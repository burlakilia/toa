'use strict'

const { reduce } = require('@toa.io/generic')
const { expand } = require('@toa.io/concise')

const { Schema } = require('./schema')
const { create, is } = require('./validator')
const { directory } = require('./directory')

/**
 * @implements {toa.schemas.Namespace}
 */
class Namespace {
  /** @type {Record<string, toa.schemas.Schema>} */
  #schemas

  /**
   * @param {toa.schemas.Schema[]} schemas
   */
  constructor (schemas) {
    this.#schemas = reduce(schemas, (schemas, schema) => (schemas[schema.id] = schema))
  }

  schema (id) {
    return this.#schemas[id]
  }
}

/** @type {toa.schemas.constructors.namespace} */
const namespace = (coses) => {
  if (typeof coses === 'string') coses = directory(coses)

  const schemas = coses.map((cos) => expand(cos, is))
  const validator = create(schemas)
  const extract = (schema) => validator.getSchema(schema.$id)
  const instantiate = (validate) => new Schema(validate)
  const instances = schemas.map(extract).map(instantiate)

  return new Namespace(instances)
}

exports.namespace = namespace
