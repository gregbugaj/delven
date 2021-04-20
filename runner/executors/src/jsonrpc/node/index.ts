import { CancellationToken } from '../common/cancellation';
import { MessageConnection } from '../common/connection';
import { MessageReader } from '../common/messageReader';
import { MessageWriter } from '../common/messageWriter';
import RIL from './ril';

// Install the node runtime abstract.
RIL.install();


export function createMessageConnection(messageReader: MessageReader, messageWriter: MessageWriter): MessageConnection {

  const connection: MessageConnection = {
    sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R> {

      messageWriter.write("DONE");
      throw new Error("Not implemented")
    },

    listen(): void {
      throw new Error("Not implemented")
    },
    end(): void {
      throw new Error("Not implemented")
    },
    dispose(): void {
      throw new Error("Not implemented")
    }
  }

  return connection;
}
