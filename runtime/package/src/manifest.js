'use strict'

const { resolve } = require('path')
const { lookup, yaml } = require('@kookaburra/gears')

const { expand } = require('./expand')
const { operations } = require('./operations')
const { events } = require('./events')
const { validate } = require('./validate')
const { collapse } = require('./collapse')
const { dereference } = require('./dereference')
const { defaults } = require('./defaults')

const manifest = async (reference, base) => {
  const manifest = await load(reference, base)

  validate(manifest)

  return manifest
}

const load = async (reference, base) => {
  const root = lookup(reference, base)
  const path = resolve(root, MANIFEST)

  const manifest = await yaml(path)

  defaults(manifest)

  await operations(root, manifest)
  await events(root, manifest)

  expand(manifest)

  if (manifest.prototype !== null) {
    const prototype = await load(manifest.prototype, root)

    collapse(manifest, prototype, root)
  }

  dereference(manifest)

  return manifest
}

const MANIFEST = 'manifest.yaml'

exports.load = manifest
