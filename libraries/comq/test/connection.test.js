'use strict'

// region setup

const { generate } = require('randomstring')

const { timeout } = require('@toa.io/generic')
const { amqplib } = require('./amqplib.mock')
const { channel: create } = require('./connection.mock')
const mock = { amqplib, channel: { create } }

jest.mock('amqplib', () => mock.amqplib)
jest.mock('../source/channel', () => mock.channel)

const presets = require('../source/presets')
const { Connection } = require('../source/connection')

it('should be', async () => {
  expect(Connection).toBeDefined()
})

/** @type {comq.Connection} */
let connection

const url = generate()

beforeEach(() => {
  jest.clearAllMocks()

  connection = new Connection(url)
})

/** @type {[string, Partial<Error>][]} */
const TRANSIENT_ERRORS = [
  ['ECONNREFUSED', { code: 'ECONNREFUSED' }],
  ['Socket closed', { message: 'Socket closed abruptly during opening handshake' }]
]

// endregion

describe('initial connection', () => {
  it('should connect', async () => {
    await connection.open()

    expect(amqplib.connect).toHaveBeenCalledWith(url)
  })

  it.each(TRANSIENT_ERRORS)('should reconnect on %s',
    async (_, error) => {
      amqplib.connect.mockImplementationOnce(async () => { throw error })

      await expect(connection.open()).resolves.not.toThrow()

      expect(amqplib.connect).toHaveBeenCalledTimes(2)
    })

  it('should throw if error is permanent', async () => {
    const error = new Error()

    amqplib.connect.mockImplementationOnce(async () => { throw error })

    await expect(connection.open()).rejects.toThrow(error)
  })
})

describe('reconnection', () => {
  /** @type {jest.MockedObject<import('amqplib').Connection>} */
  let conn

  beforeEach(async () => {
    await connection.open()

    conn = await amqplib.connect.mock.results[0].value
  })

  it('should reconnect on error', async () => {
    expect(amqplib.connect).toHaveBeenCalledTimes(1)

    // const clear = jest.spyOn(conn, 'removeAllListeners')
    const error = { message: generate() }

    conn.emit('close', error)

    expect(conn.removeAllListeners).toHaveBeenCalled()
    expect(amqplib.connect).toHaveBeenCalledTimes(2)
  })

  it('should not reconnect without error', async () => {
    conn.emit('close')

    expect(amqplib.connect).toHaveBeenCalledTimes(1)
  })

  it('should prevent process crash', async () => {
    expect(conn.on).toHaveBeenCalledWith('error', expect.any(Function))
  })

  it('should recover channels', async () => {
    const channel = await connection.createChannel('request')

    //    const channel = await create.mock.results[0].value

    expect(channel).toBeDefined()

    conn.emit('close', new Error())

    await timeout(0)

    expect(amqplib.connect).toHaveBeenCalledTimes(2)

    const replacement = await amqplib.connect.mock.results[1].value

    expect(channel.recover).toHaveBeenCalledWith(replacement)
  })
})

describe('create channel', () => {
  /** @type {jest.MockedObject<import('amqplib').Connection>} */
  let conn

  beforeEach(async () => {
    await connection.open()

    conn = await amqplib.connect.mock.results[0].value
  })

  it.each(
    /** @type {comq.topology.type[]} */
    ['request', 'reply', 'event'])('should create channel of %s type',
    async (type) => {
      // noinspection JSCheckFunctionSignatures
      create.mockImplementationOnce(async () => generate())

      const preset = presets[type]
      const channel = await connection.createChannel(type)

      expect(create).toHaveBeenCalledWith(conn, preset)
      expect(channel).toStrictEqual(await create.mock.results[0].value)
    })

  it('should create channel after exception', async () => {
    create.mockImplementation(async () => { throw new Error() })

    setTimeout(() => {
      // noinspection JSCheckFunctionSignatures
      create.mockImplementation(async () => generate())

      conn.emit('close', new Error())
    }, 1)

    const channel = await connection.createChannel('request')

    expect(channel).toStrictEqual(await create.mock.results[1].value)
  })
})

it('should close connection', async () => {
  await connection.open()
  await connection.close()

  const amqp = await amqplib.connect.mock.results[0].value

  expect(amqp.close).toHaveBeenCalled()
})

describe('diagnostics', () => {
  beforeEach(async () => {
    await connection.open()
  })

  it('should emit `open` event', async () => {
    let captured = false

    connection.diagnose('open', () => (captured = true))

    await connection.open()

    expect(captured).toStrictEqual(true)
  })

  it('should re-emit `close` event', async () => {
    let captured

    connection.diagnose('close', (error) => (captured = error))

    const amqp = await amqplib.connect.mock.results[0].value
    const error = generate()

    amqp.emit('close', error)

    expect(captured).toStrictEqual(error)
  })
})
