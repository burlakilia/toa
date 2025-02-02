'use strict'

const { Images } = require('@toa.io/operations')
const { context: load } = require('@toa.io/norm')

const images = async (path) => {
  const context = await load(path)

  return new Images(context)
}

exports.images = images
