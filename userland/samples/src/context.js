'use strict'

const norm = require('@toa.io/norm')

const test = require('./components')
const { context: load } = require('./suite')
const { replay } = require('./replay')

/** @type {toa.samples.replay.context} */
const context = async (path) => {
  const context = await norm.context(path)
  const paths = context.components.map((component) => component.path)
  const suite = await load(path)

  return await test.components(paths) && await replay(suite, paths)
}

exports.context = context
