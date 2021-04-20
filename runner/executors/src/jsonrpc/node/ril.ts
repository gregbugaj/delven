import { Disposable } from "../common/disposable";
import RAL from "../common/ral";

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
    stream: Object.freeze({
      asReadableStream: (stream: NodeJS.ReadableStream) => new ReadableStreamWrapper(stream),
      asWritableStream: (stream: NodeJS.WritableStream) => new WritableStreamWrapper(stream)
    }),

    timer: {
      setTimeout: setTimeout
    }
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
