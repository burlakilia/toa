'use strict'

/**
 * @param id {string}
 * @return {toa.formation.component.Component}
 */
const component = (id) => {
  const [domain, name] = id.split('.')

  return {
    domain,
    name,
    version: '0.0.0',
    locator: {
      domain,
      name,
      id,
      label: `${domain}-${name}`
    }
  }
}

/** @type {toa.formation.context.Context} */
const context = {
  runtime: '0.0.0',
  name: 'test',
  description: 'context fixture',
  version: '0.0.0',
  packages: 'domains/**/*',
  registry: 'localhost:5000',
  components: [
    component('a.b'),
    component('b.a'),
    component('d.a'),
    component('d.b'),
    component('d.c')
  ],
  compositions: [
    {
      name: 'foo',
      components: [component('a.b'), component('b.a')]
    },
    {
      name: 'bar',
      components: [component('d.c'), component('a.b')]
    }
  ]
}

/** @type {Array<toa.formation.context.Composition>} */
const compositions = [
  ...context.compositions,
  {
    name: 'd-a',
    components: [component('d.a')]
  },
  {
    name: 'd-b',
    components: [component('d.b')]
  }
]

exports.context = context
exports.compositions = compositions
