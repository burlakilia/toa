'use strict'

const { call } = require('./call')
const { cascade } = require('./cascade')
const { component } = require('./component')
const { composition } = require('./composition')
const { context } = require('./context')
const { deployment } = require('./deployment')
const { emission } = require('./emission')
const { exposition } = require('./exposition')
const { extensions } = require('./extensions')
const { images } = require('./images')
const { operation } = require('./operation')
const { receivers } = require('./receivers')
const { remote } = require('./remote')
const { runtime } = require('./runtime')
const { storage } = require('./storage')

exports.bindings = require('./bindings')
exports.bridge = require('./bridge')
exports.contract = require('./contract')
exports.discovery = require('./discovery')

exports.call = call
exports.cascade = cascade
exports.composition = composition
exports.context = context
exports.deployment = deployment
exports.emission = emission
exports.exposition = exposition
exports.extensions = extensions
exports.images = images
exports.component = component
exports.operation = operation
exports.receivers = receivers
exports.remote = remote
exports.runtime = runtime
exports.storage = storage
