'use strict'

const { PORT } = require('./constants')

/**
 * @param {toa.formation.component.Brief[]} components
 * @param {toa.extensions.resources.Annotations} annotations
 * @returns {toa.operations.deployment.dependency.Declaration}
 */
const deployment = (components, annotations) => {
  const group = 'resources'
  const name = 'exposition'
  const version = require('../package.json').version
  const port = PORT
  const ingress = annotations

  /** @type {toa.operations.deployment.dependency.Service} */
  const exposition = { group, name, version, port, ingress }

  return { services: [exposition] }
}

exports.deployment = deployment
