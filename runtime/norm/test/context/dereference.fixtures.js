'use strict'

const clone = require('clone-deep')

/**
 * @param id {string}
 * @return {toa.norm.component.Declaration}
 */
const component = (id) => {
  const [namespace, name] = id.split('.')

  return {
    namespace,
    name,
    version: '0.0.0',
    locator: {
      namespace,
      name,
      id,
      label: `${namespace}-${name}`
    },
    entity: null
  }
}

const context = {
  name: 'test',
  description: 'context fixture',
  version: '0.0.0',
  runtime: '0.0.0',
  packages: 'namespaces/**/*',
  registry: 'localhost:5000',
  components: [component('a.b'), component('b.a'), component('d.c')],
  compositions: [
    {
      name: 'foo',
      components: ['a.b', 'b.a']
    },
    {
      name: 'bar',
      components: ['d.c', 'a.b']
    }
  ]
}

const expected = clone(context)

expected.compositions = [
  {
    name: 'foo',
    components: [component('a.b'), component('b.a')]
  },
  {
    name: 'bar',
    components: [component('d.c'), component('a.b')]
  }
]

exports.context = context
exports.expected = expected
