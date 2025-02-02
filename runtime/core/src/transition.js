'use strict'

const { retry } = require('@toa.io/generic')

const { Operation } = require('./operation')
const { StateConcurrencyException } = require('./exceptions')

class Transition extends Operation {
  #concurrency

  constructor (cascade, scope, contract, query, definition) {
    super(cascade, scope, contract, query, definition)

    this.#concurrency = definition.concurrency
  }

  async process (store) {
    return retry((retry) => this.#retry(store, retry), RETRY)
  }

  async acquire (store) {
    const { request } = store

    store.scope = request.query ? await this.query(request.query) : this.scope.init()
    store.state = store.scope.get()
  }

  async commit (store) {
    const { scope, state, reply, retry } = store

    if (reply.error !== undefined) return

    scope.set(state)

    const ok = await this.scope.commit(scope)

    if (ok !== true) {
      if (this.#concurrency === 'retry') retry()
      else throw new StateConcurrencyException()
    }
  }

  async #retry (store, retry) {
    store.retry = retry

    return super.process(store)
  }
}

/** @type {toa.generic.retry.Options} */
const RETRY = {
  base: 10,
  dispersion: 1,
  max: 5000,
  retries: Infinity
}

exports.Transition = Transition
