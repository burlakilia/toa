'use strict'

const { entity, bridge, operations, events, receivers, extensions } = require('./.expand')

const expand = (manifest) => {
  entity(manifest)
  bridge(manifest)
  operations(manifest)
  events(manifest)
  receivers(manifest)
  extensions(manifest)
}

exports.expand = expand
