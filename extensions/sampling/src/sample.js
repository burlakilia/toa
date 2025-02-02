'use strict'

const generic = require('@toa.io/generic')

const id = Symbol('sampling')

/** @type {toa.generic.context.Storage} */
const context = generic.context(id)

exports.context = context
