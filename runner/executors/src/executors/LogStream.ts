import LoggerFactory from './logger';
import { Subject, Subscription } from "rxjs";
import Utils from '../util';

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
    this.eventStream.next(event);
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
    this.logger.info(this.format(msg))
    this.emit({ level: "info", message: this.format(msg) })
  }

  warn(...msg): void {
    this.logger.warn(this.format(msg))
    this.emit({ level: "warn", message: this.format(msg) })
  }

  error(...msg): void {
    this.logger.error(this.format(msg))
    this.emit({ level: "error", message: this.format(msg) })
  }

  trace(...msg): void {
    this.logger.trace(this.format(msg))
    this.emit({ level: "trace", message: this.format(msg) })
  }

  _sanitize(...msg): any[] {
    // as the window logger does not work same way as console.info we need to conver argumnent into a message string
    // console.info(...msg)
    const converted: any[] = []
    for (let i = 0; i < msg.length; ++i) {
      const obj = msg[i]
      if (obj instanceof Error) {
        Utils.ErrorSerializer(obj)
        converted[i] = obj.toJSON()
      } else {
        converted[i] = obj
      }
    }
    return converted
  } catch(err) {
    console.error(err)
  }
}
