'use strict'

const { expand } = require('@toa.io/libraries/cos')
const { defined } = require('@toa.io/libraries/generic')
const { create, valid } = require('./validator')

/**
 * @implements {toa.schemas.Schema}
 */
class Schema {
  /** @type {string} */
  id

  /** @type {import('ajv').ValidateFunction } */
  #validate

  /**
   * @param {import('ajv').ValidateFunction} validate
   */
  constructor (validate) {
    this.id = validate.schema.$id
    this.#validate = validate
  }

  fit (value) {
    const valid = this.#validate(value)

    if (valid) return null
    else return this.#error()
  }

  #error = () => {
    const error = this.#validate.errors[0]

    const mapped = {
      message: error.message,
      keyword: error.keyword,
      property: error.propertyName,
      path: error.instancePath,
      schema: error.schemaPath
    }

    return defined(mapped)
  }
}

/** @type {toa.schemas.constructors.schema} */
const schema = (cos) => {
  const validator = create()
  const schema = expand(cos, valid)
  const validate = validator.compile(schema)

  return new Schema(validate)
}

exports.Schema = Schema
exports.schema = schema
