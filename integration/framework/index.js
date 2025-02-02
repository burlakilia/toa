'use strict'

const { cli } = require('./cli')
const { compose } = require('./compose')
const { discovery } = require('./discovery')
const { env } = require('./env')
const { remote } = require('./remote')

exports.mongodb = require('./mongodb')
exports.docker = require('./docker')

exports.cli = cli
exports.compose = compose
exports.discovery = discovery
exports.env = env
exports.remote = remote
