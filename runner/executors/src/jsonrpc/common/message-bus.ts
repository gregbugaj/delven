import { filter } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";

interface CallbackFunction<T = any> {
  (event: T): void;
}

interface NewableType<T> {
  new(...args: any[]): T;
}

class ErrorHandler {
  public handleError(error: any): void {
    console.info('Error : ' + error);
    console.error(error)
  }
}

export class Emitter<T> {

  private eventStream: Subject<T>;

  private errorHandler: ErrorHandler;

  // constructor(errorHandler: ErrorHandler) {
  constructor() {
    this.errorHandler = new ErrorHandler()
    this.eventStream = new Subject();
  }

  /**
   * push the given event onto the message bus.
   * @param event
   */
  public emit(event: any): void {
    console.warn(`MB.emit : ${JSON.stringify(event)}`)
    this.eventStream.next(event);
  }

  /**
   * Alias for emit
   * @param event
   */
  public fire(event: any): void {
    console.warn(`MB.fire : ${JSON.stringify(event)}`)
    this.emit(event)
  }

  dispose() {
    if (this.eventStream) {
      this.eventStream.unsubscribe();
    }
  }

  /**
   * Subscribe to all events on the message bus.
   */
  public subscribe(callback: CallbackFunction, callbackContext: any = null): Subscription {
    return this.eventStream.subscribe(
      (event: any): void => {
        try {
          callback.call(callbackContext, event);
        } catch (error) {
          this.errorHandler.handleError(error);
        }
      }
    );
  }

  /**
   * Subscribe to the message bus, but only invoke the callback when the event is
   * of the given newable type (ie, it's a Class definition, not an instance).
   * --
   * NOTE: The NewableType<T> will allow for Type inference.
  */
  public on<T>(typeFilter: NewableType<T>, callback: CallbackFunction<T>, callbackContext: any = null): Subscription {
    // console.warn(`MB.on : ${JSON.stringify(typeFilter)}`)
    const subscription = this.eventStream
      .pipe(filter((event: any): boolean => {
        return event instanceof typeFilter
      }))
      .subscribe(
        (event: T): void => {
          try {
            callback.call(callbackContext, event);
          } catch (error) {
            this.errorHandler.handleError(error);
          }
        }
      )
    return subscription;
  }
}
