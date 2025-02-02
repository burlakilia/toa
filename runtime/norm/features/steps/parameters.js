'use strict'

const { defineParameterType } = require('@cucumber/cucumber')

defineParameterType({
  name: 'operation',
  regexp: /transition|observation|assignment/,
  transformer: (type) => type
})
