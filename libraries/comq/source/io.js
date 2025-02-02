'use strict'

const { EventEmitter } = require('node:events')
const { randomBytes } = require('node:crypto')
const { lazy, track, failsafe, promex } = require('@toa.io/generic')

const { decode } = require('./decode')
const { encode } = require('./encode')
const io = require('./.io')

/**
 * @implements {comq.IO}
 */
class IO {
  /** @type {comq.Connection} */
  #connection

  /** @type {comq.Channel} */
  #requests

  /** @type {comq.Channel} */
  #replies

  /** @type {comq.Channel} */
  #events

  /** @type {Record<string, comq.ReplyEmitter>} */
  #emitters = {}

  /** @type {Set<toa.generic.Promex>} */
  #pendingReplies = new Set()

  #diagnostics = new EventEmitter()

  /**
   * @param {comq.Connection} connection
   */
  constructor (connection) {
    this.#connection = connection

    for (const event of CONNECTION_EVENTS) {
      this.#connection.diagnose(event, (...args) => this.#diagnostics.emit(event, ...args))
    }
  }

  reply = lazy(this, this.#createRequestReplyChannels,
    /**
     * @param {string} queue
     * @param {comq.producer} callback
     * @returns {Promise<void>}
     */
    async (queue, callback) => {
      const consumer = this.#getRequestConsumer(callback)

      await this.#requests.consume(queue, consumer)
    })

  request = lazy(this, [this.#createRequestReplyChannels, this.#consumeReplies],
    failsafe(this, this.#recover,
      /**
       * @param {string} queue
       * @param {any} payload
       * @param {comq.encoding} [encoding]
       * @returns {Promise<void>}
       */
      async (queue, payload, encoding) => {
        const [buffer, contentType] = this.#encode(payload, encoding)
        const correlationId = randomBytes(8).toString('hex')
        const emitter = this.#emitters[queue]
        const replyTo = emitter.queue
        const properties = { contentType, correlationId, replyTo }
        const reply = this.#createReply()

        emitter.once(correlationId, reply.resolve)

        await this.#requests.send(queue, buffer, properties)

        return reply
      }))

  consume = lazy(this, this.#createEventChannel,
    async (exchange, group, callback) => {
      const queue = io.concat(exchange, group)
      const consumer = this.#getEventConsumer(callback)

      await this.#events.subscribe(exchange, queue, consumer)
    })

  emit = lazy(this, this.#createEventChannel,
    /**
     * @param {string} exchange
     * @param {any} payload
     * @param {comq.encoding} [encoding]
     * @returns {Promise<void>}
     */
    async (exchange, payload, encoding) => {
      const [buffer, contentType] = this.#encode(payload, encoding)
      const properties = { contentType }

      await this.#events.publish(exchange, buffer, properties)
    })

  async seal () {
    await this.#requests?.seal()
    await this.#events?.seal()
  }

  async close () {
    await this.seal()
    await track(this)
    await this.#connection.close()
  }

  diagnose (event, listener) {
    this.#diagnostics.on(event, listener)
  }

  // region initializers

  async #createRequestReplyChannels () {
    this.#requests = await this.#createChannel('request')
    this.#replies = await this.#createChannel('reply')

    this.#requests.diagnose('recover', this.#resend)
  }

  async #createEventChannel () {
    this.#events = await this.#createChannel('event')
  }

  async #consumeReplies (queue) {
    const emitter = io.createReplyEmitter(queue)
    const consumer = this.#getReplyConsumer(queue, emitter)

    this.#emitters[queue] = emitter

    await this.#replies.consume(emitter.queue, consumer)
  }

  // endregion

  /**
   * @param {comq.topology.type} type
   * @returns {Promise<comq.Channel>}
   */
  async #createChannel (type) {
    const channel = await this.#connection.createChannel(type)

    for (const event of CHANNEL_EVENTS) {
      channel.diagnose(event, (...args) => this.#diagnostics.emit(event, type, ...args))
    }

    return channel
  }

  /**
   * @param {comq.producer} producer
   * @returns {comq.channels.consumer}
   */
  #getRequestConsumer = (producer) =>
    track(this, async (message) => {
      if (!('replyTo' in message.properties)) throw new Error('Request is missing the `replyTo` property')

      const payload = decode(message)
      const reply = await producer(payload)

      if (reply === undefined) throw new Error('The `producer` function must return a value')

      let { correlationId, contentType } = message.properties

      if (Buffer.isBuffer(reply)) contentType = OCTETS
      if (contentType === undefined) throw new Error('Reply to a Request without the `contentType` property must be of type `Buffer`')

      const buffer = contentType === OCTETS ? reply : encode(reply, contentType)
      const properties = { contentType, correlationId }

      await this.#replies.throw(message.properties.replyTo, buffer, properties)
    })

  /**
   * @param {string} queue
   * @param {comq.ReplyEmitter} emitter
   * @returns {comq.channels.consumer}
   */
  #getReplyConsumer = (queue, emitter) =>
    (message) => {
      const payload = decode(message)

      emitter.emit(message.properties.correlationId, payload)
    }

  /**
   * @param {comq.consumer} callback
   * @returns {comq.channels.consumer}
   */
  #getEventConsumer = (callback) =>
    track(this, async (message) => {
      const payload = decode(message)

      await callback(payload)
    })

  /**
   * @return {toa.generic.Promex}
   */
  #createReply () {
    const reply = promex()

    this.#pendingReplies.add(reply)

    reply.catch(noop).finally(() => this.#pendingReplies.delete(reply))

    return reply
  }

  #recover (exception) {
    if (exception !== REJECTION) return false
  }

  #resend = () => {
    for (const emitter of Object.values(this.#emitters)) emitter.clear()
    for (const reply of this.#pendingReplies) reply.reject(REJECTION)
  }

  /**
   * @param {any} payload
   * @param {comq.encoding} [encoding]
   * @returns [Buffer, string]
   */
  #encode (payload, encoding) {
    const raw = Buffer.isBuffer(payload)

    encoding ??= raw ? OCTETS : DEFAULT

    const buffer = raw ? payload : encode(payload, encoding)

    return [buffer, encoding]
  }
}

/** @type {comq.encoding} */
const OCTETS = 'application/octet-stream'

/** @type {comq.encoding} */
const DEFAULT = 'application/msgpack'

/** @type {comq.diagnostics.event[]} */
const CONNECTION_EVENTS = ['open', 'close']

/** @type {comq.diagnostics.event[]} */
const CHANNEL_EVENTS = ['flow', 'drain', 'recover', 'discard']

const REJECTION = /** @type {Error} */ Symbol('resend')

function noop () {}

exports.IO = IO
