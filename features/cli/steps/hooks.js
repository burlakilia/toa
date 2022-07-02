'use strict'

const assert = require('node:assert')
const { resolve } = require('node:path')

const { BeforeAll, Before } = require('@cucumber/cucumber')

BeforeAll(() => {
  process.env.TOA_ENV = 'local'
})

Before(function () {
  process.chdir(ROOT)

  assert.equal(process.cwd(), ROOT)

  this.cwd = ROOT
})

const ROOT = resolve(__dirname, '../../../')
