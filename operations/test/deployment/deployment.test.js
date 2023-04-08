'use strict'

const clone = require('clone-deep')

const fixtures = require('./deployment.fixtures')
const { Deployment } = require('../../src/deployment/deployment')

/** @type {toa.deployment.Deployment} */
let deployment
/** @type {toa.deployment.installation.Options} */
let options

beforeEach(() => {
  deployment = new Deployment(fixtures.context, fixtures.compositions, fixtures.dependencies, fixtures.process)
  options = clone(fixtures.options)
})

it('should pass -n argument if options.namespace is set', async () => {
  await deployment.install(options)

  const call = fixtures.process.execute.mock.calls.find((call) => call[0] === 'helm' && call[1][0] === 'upgrade')

  expect(call).toBeDefined()

  const args = call[1]
  const index = args.findIndex((value) => value === '-n')
  const namespace = args[index + 1]

  expect(index).not.toStrictEqual(-1)
  expect(namespace).toStrictEqual(fixtures.options.namespace)
})

it('should forbid local deployment environment', () => {
  const context = clone(fixtures.context)

  context.environment = 'local'

  const create = () => new Deployment(context, fixtures.compositions, fixtures.dependencies, fixtures.process)

  expect(create).toThrow(/name 'local' is not allowed/)
})

describe('variables', () => {
  let deployment /** @type {toa.deployment.Deployment} */

  it('should be define', () => {
    const context = clone(fixtures.context)

    deployment = new Deployment(context, fixtures.compositions, fixtures.dependencies, fixtures.process)

    expect(typeof deployment.variables).toBe('function')
  })

  it('should return variables', () => {
    const context = clone(fixtures.context)
    const [{ variables }] = fixtures.dependencies

    deployment = new Deployment(context, fixtures.compositions, fixtures.dependencies, fixtures.process)
    expect(deployment.variables()).toEqual(variables)
  })
})
