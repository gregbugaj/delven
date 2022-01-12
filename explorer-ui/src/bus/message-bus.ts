import {filter} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";

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

export class MessageBusService {

    private eventStream: Subject<any>;

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
     * This is a convenience class that makes it easier to subscribe and unsubscribe to events
     * within a single, cohesive context (such as a component).
     */
    public group(): MessageBusGroup {
        return (new MessageBusGroup(this));
    }

    /**
     * Subscribe to all events on the message bus.
     */
    public subscribe(callback: CallbackFunction, callbackContext: any = null): Subscription {
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
                        // callback.call(callbackContext, event);
                        callback.apply(callbackContext, [event])
                    } catch (error) {
                        this.errorHandler.handleError(error);
                    }
                }
            )
        return subscription;
    }
}

/**
 * convenience class that keeps track of subscriptions within the group and can
 * mass-unsubscribe from them as needed. Because of this tracking, the methods on this
 * class return a reference to THIS class, instead of a Subscription, allowing for a more fluent API.
 */
export class MessageBusGroup {
    private messageBus: MessageBusService;
    private subscriptions: Subscription[];

    constructor(messageBus: MessageBusService) {
        this.messageBus = messageBus;
        this.subscriptions = [];
    }

    /**
     *  Push the given event onto the message bus.
     * @param event
     */
    public emit(event: any): MessageBusGroup {
        this.messageBus.emit(event);
        return this;
    }

    /**
     * subscribe to the message bus, but only invoke the callback when the event is
     *  of the given newable type (ie, it's a Class definition, not an instance).
     * @param typeFilter
     * @param callback
     * @param callbackContext
     */
    public on<T>(typeFilter: NewableType<T>, callback: CallbackFunction<T>, callbackContext: any = null): MessageBusGroup {
        this.subscriptions.push(this.messageBus.on(typeFilter, callback, callbackContext))
        return this
    }

    /**
     * subscribe to all events on the message bus.
     */
    public subscribe(callback: CallbackFunction, callbackContext: any = null): MessageBusGroup {
        this.subscriptions.push(this.messageBus.subscribe(callback, callbackContext))
        return this
    }
}
