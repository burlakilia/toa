import { Connector } from '@toa.io/core/types'
import * as comq from 'comq'

declare namespace toa.amqp {

  interface Communication extends Connector {
    request(queue: string, request: any): Promise<any>

    reply(queue: string, process: comq.producer): Promise<void>

    emit(exchange: string, message: any): Promise<void>

    consume(exchange: string, group: string, callback: comq.consumer): Promise<void>
  }

}
