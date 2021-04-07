import LoggerFactory from './logger';
import { Subject } from "rxjs";
import { Subscription } from "rxjs";

const util = require('util')

class ErrorHandler {
  public handleError(error: any): void {
    console.info('Error : ' + error);
    console.error(error)
  }
}

/**
 * Log Stream
 * console.error and console.warn outputs to stderr. The others output to stdout.
 */
export default class LogStream {
  id: string;
  creationTime: number;
  logger: any;
  eventStream: Subject<any>;
  errorHandler: ErrorHandler;

  constructor(id: string) {
    this.id = id
    this.creationTime = Date.now()
    this.eventStream = new Subject();
    this.errorHandler = new ErrorHandler()

    this.logger = LoggerFactory.createLogger(id, {
      logsDirPath: "./logs/",
      logLevel: "debug"
    })
  }

  getLogStreamName(): string {
    return this.id
  }

  private format(msg: any[]): any {
    return util.format(...msg);
  }

  private emit(event: any): void {
    this.eventStream.next(...event);
  }

  /**
  * Subscribe to all events on log bus.
  */
  subscribe(callback: (event: any) => void, callbackContext: any = null): Subscription {
    const subscription = this.eventStream.subscribe(
      (event: any): void => {
        try {
          callback.call(callbackContext, event);
        } catch (error) {
          this.errorHandler.handleError(error);
        }
      }
    );
    return subscription;
  }

  log(...msg): void {
    this.logger.log("info", util.format(...msg))
    this.emit(msg)
  }

  info(...msg): void {
    // as the window logger does not work same way as console.info we need to conver argumnent into a message string
    // console.info(...msg)
    this.logger.info(this.format(msg))
    this.emit(msg)
  }

  warn(...msg): void {
    this.logger.warn(this.format(msg))
    this.emit(msg)
  }

  error(...msg): void {
    this.logger.error(this.format(msg))
    this.emit(msg)
  }

  trace(...msg): void {
    this.logger.trace(this.format(msg))
    this.emit(msg)
  }
}
