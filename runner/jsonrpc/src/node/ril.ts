import RAL from "../common/ral";
import { TextDecoder } from 'util';
import { Disposable } from "../common/disposable";
import { Message } from "../common/messages";
import { ContentTypeDecoderOptions, ContentTypeEncoderOptions } from "../common/encoding";
import { AbstractMessageBuffer } from "../common/messageBuffer";

class MessageBuffer extends AbstractMessageBuffer {

	private static readonly emptyBuffer: Buffer = Buffer.allocUnsafe(0);

	constructor(encoding: RAL.MessageBufferEncoding = 'utf-8') {
		super(encoding);
	}

	protected emptyBuffer(): Uint8Array {
		return MessageBuffer.emptyBuffer;
	}

	protected fromString(value: string, encoding: RAL.MessageBufferEncoding): Buffer {
		return Buffer.from(value, encoding);
	}

	protected toString(value: Uint8Array, encoding: RAL.MessageBufferEncoding): string {
		if (value instanceof Buffer) {
			return value.toString(encoding);
		} else {
			return new TextDecoder(encoding).decode(value);
		}
	}
	protected asNative(buffer: Uint8Array, length?: number): Buffer {
		if (length === undefined) {
			return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
		} else {
			return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
		}
	}

	protected allocNative(length: number): Uint8Array {
		return Buffer.allocUnsafe(length);
	}
}

class ReadableStreamWrapper implements RAL.ReadableStream {

  constructor(private stream: NodeJS.ReadableStream) {
  }

  public onClose(listener: () => void): Disposable {
    this.stream.on('close', listener);
    return Disposable.create(() => this.stream.off('close', listener));
  }

  public onError(listener: (error: any) => void): Disposable {
    this.stream.on('error', listener);
    return Disposable.create(() => this.stream.off('error', listener));
  }

  public onEnd(listener: () => void): Disposable {
    this.stream.on('end', listener);
    return Disposable.create(() => this.stream.off('end', listener));
  }

  public onData(listener: (data: Uint8Array) => void): Disposable {
    this.stream.on('data', listener);
    return Disposable.create(() => this.stream.off('data', listener));
  }
}


class WritableStreamWrapper implements RAL.WritableStream {

  constructor(private stream: NodeJS.WritableStream) {
  }

  public onClose(listener: () => void): Disposable {
    this.stream.on('close', listener);
    return Disposable.create(() => this.stream.off('close', listener));
  }

  public onError(listener: (error: any) => void): Disposable {
    this.stream.on('error', listener);
    return Disposable.create(() => this.stream.off('error', listener));
  }

  public onEnd(listener: () => void): Disposable {
    this.stream.on('end', listener);
    return Disposable.create(() => this.stream.off('end', listener));
  }

  public write(data: Uint8Array | string, encoding?: RAL.MessageBufferEncoding): Promise<void> {
    return new Promise((resolve, reject) => {
      const callback = (error: Error | undefined | null) => {
        if (error === undefined || error === null) {
          resolve();
        } else {
          reject(error);
        }
      };
      if (typeof data === 'string') {
        this.stream.write(data, encoding, callback);
      } else {
        this.stream.write(data, callback);
      }
    });
  }

  public end(): void {
    this.stream.end();
  }
}


interface RIL extends RAL {
  readonly stream: {
    readonly asReadableStream: (stream: NodeJS.ReadableStream) => RAL.ReadableStream;
    readonly asWritableStream: (stream: NodeJS.WritableStream) => RAL.WritableStream;
  }
}

const _ril = Object.freeze<RIL>(
  {
    messageBuffer: Object.freeze({
      create: (encoding: RAL.MessageBufferEncoding) => new MessageBuffer(encoding)
    }),

    applicationJson: Object.freeze({
      encoder: {
        name: 'application/json',
        encode: (msg: Message, options: ContentTypeEncoderOptions): Promise<Buffer> => {
          try {
            return Promise.resolve(Buffer.from(JSON.stringify(msg, undefined, 0), options.charset));
          } catch (err) {
            return Promise.reject(err);
          }
        }
      },

      decoder: Object.freeze({
        name: 'application/json',
        decode: (buffer: Uint8Array | Buffer, options: ContentTypeDecoderOptions): Promise<Message> => {
          try {
            if (buffer instanceof Buffer) {
              return Promise.resolve(JSON.parse(buffer.toString(options.charset)));
            } else {
              return Promise.resolve(JSON.parse(new TextDecoder(options.charset).decode(buffer)));
            }
          } catch (err) {
            return Promise.reject(err);
          }
        }
      })
    }),

    stream: Object.freeze({
      asReadableStream: (stream: NodeJS.ReadableStream) => new ReadableStreamWrapper(stream),
      asWritableStream: (stream: NodeJS.WritableStream) => new WritableStreamWrapper(stream)
    }),

    timer: Object.freeze({
      setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): RAL.TimeoutHandle {
        return setTimeout(callback, ms, ...args) as unknown as RAL.TimeoutHandle;
      },
      clearTimeout(handle: RAL.TimeoutHandle): void {
        clearTimeout(handle as unknown as NodeJS.Timeout);
      },
      setImmediate(callback: (...args: any[]) => void, ...args: any[]): RAL.ImmediateHandle {
        return setImmediate(callback, ...args) as unknown as RAL.ImmediateHandle;
      },
      clearImmediate(handle: RAL.ImmediateHandle): void {
        clearImmediate(handle as unknown as NodeJS.Immediate);
      }
    })

  }
)

function RIL(): RIL {
  return _ril
}

namespace RIL {
  export function install() {
    RAL.install(_ril)
  }
}


export default RIL;
