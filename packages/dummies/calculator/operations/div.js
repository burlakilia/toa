'use strict'

async function transition ({ input, output }) {
  output.div = input.a / input.b
}

module.exports = transition
