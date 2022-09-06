import * as fetch from 'node-fetch'

import * as _extensions from '@toa.io/core/types/extensions'
import * as _retry from '@toa.io/libraries/generic/types/retry'

declare namespace toa.extensions.origins {

  namespace invocation {
    type Options = {
      substitutions?: string[]
      retry?: _retry.Options
    }
  }

  interface Annex extends _extensions.Annex {
    invoke(name: string, path: string, request: fetch.RequestInit, options?: invocation.Options): Promise<fetch.Response>
  }

}
