'use strict'

/** @type {toa.generic.failsafe} */
const failsafe = (context, recover, method = undefined) => {
  if (method === undefined) {
    method = recover
    recover = undefined
  }

  return async function call (...args) {
    try {
      return await method.apply(context, args)
    } catch (exception) {
      if (recover !== undefined && await recover.call(context, exception) === false) throw exception

      return call.apply(this, args)
    }
  }
}
exports.failsafe = failsafe
