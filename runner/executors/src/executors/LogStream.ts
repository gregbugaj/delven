const stream = require('stream')
// const fs = require('fs')
import { writeFile } from 'fs/promises'

const winston = require('winston');

/**
 * Log Stream
 * console.error and console.warn outputs to stderr. The others output to stdout.
 */
export default class LogStream {
  id: string;
  creationTime: number;
  logger: any;


  constructor(id: string) {
    this.id = id
    this.creationTime = Date.now()
    this.logger = require('logger.js').default('MY_MODULE_NAME');
  }

  getLogStreamName(): string {
    return this.id
  }

  log(...args): void {
    console.info(args)
  }

  info(...args): void {
    this.logger.info.apply(this, args)
  }
}
