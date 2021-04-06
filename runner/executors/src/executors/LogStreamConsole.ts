const stream = require('stream')
// const fs = require('fs')
import { writeFile } from 'fs/promises'

/**
 * Log Stream
 * console.error and console.warn outputs to stderr. The others output to stdout.
 */
export default class LogStream {
  id: string;
  creationTime: number;
  _console: Console

  constructor(id: string) {
    this.id = id
    this.creationTime = Date.now()

    const collection = {
      stdout: new stream.Writable(),
      stderr: new stream.Writable()
    }

    const options = {}
    const overwrites = Object.assign({}, {
      stdout: collection.stdout,
      stderr: collection.stderr
    }, options)

    const Console = console.Console
    this._console = new Console(overwrites)

    Object.keys(collection).forEach((name) => {
      collection[name].write = function (chunk, encoding, callback) {
        console.warn(`Service : ${chunk}`)
        writeFile(`./${id}-${name}.log`, JSON.stringify({ 'ts': Date.now(), chunk }) + "\n", { encoding: "utf-8", flag: "a" })
          .catch((err) => {
            console.error(err);
          });
      }
    })

    this._console.log('capture #1')
    this._console.info('\x1B[96mCaptured stdout\x1B[00m' + new Date().getTime())
  }

  getLogStreamName(): string {
    return this.id
  }

  log(...args): void {
    console.info(args)
  }

  info(...args): void {
    this._console.info.apply(this, args)
  }
}
