import { ConsumeMessage, Options, Connection } from 'amqplib'
import * as _diagnostics from './diagnostic'

declare namespace comq {

  namespace channels {

    type consumer = (message: ConsumeMessage) => void | Promise<void>

  }

  interface Channel {
    create(connection: Connection): Promise<void>

    consume(queue: string, consumer: channels.consumer): Promise<void>

    subscribe(exchange: string, queue: string, consumer: channels.consumer): Promise<void>

    send(queue: string, buffer: Buffer, options?: Options.Publish): Promise<void>

    throw(queue: string, buffer: Buffer, options?: Options.Publish): Promise<void>

    publish(exchange: string, buffer: Buffer, options?: Options.Publish): Promise<void>

    seal(): Promise<void>

    diagnose(event: _diagnostics.event, listener: Function): void

    recover(connection: Connection): Promise<void>
  }

}

export type Channel = comq.Channel
export type consumer = comq.channels.consumer
