'use strict'

const presets = require('../source/presets')

it('should define request preset', async () => {
  expect(presets.request).toStrictEqual({
    prefetch: 300,
    confirms: false,
    durable: true,
    acknowledgements: true,
    persistent: false
  })
})

it('should define reply preset', async () => {
  expect(presets.reply).toStrictEqual({
    prefetch: 0,
    confirms: false,
    durable: false,
    acknowledgements: false,
    persistent: false
  })
})

it('should define event preset', async () => {
  expect(presets.event).toStrictEqual({
    prefetch: 300,
    confirms: true,
    durable: true,
    acknowledgements: true,
    persistent: true
  })
})
