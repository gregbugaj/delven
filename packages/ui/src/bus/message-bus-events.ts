/**
 * The only guarantee that this class makes is a read-only Type.
 */
abstract class MessageBusEvent {
  public readonly type: string | undefined;
}

/**
 * This class guarantees a payload with a given interface.
 */
abstract class EventWithPayload<T> extends MessageBusEvent {
  public readonly data?: T;
  constructor(data: T) {
    super()
    this.data = data;
  }
}

// ----------------------------------------------------------------------------------- //
// Each of the following classes has both a STATIC and an INSTANCE [type] of the same
// value (the instance value is read from the static value). This allows you to use the
// instance type in a discriminating union while comparing it to the static type. In
// other words, you only have to import the one Event class to get access to both values.
// ----------------------------------------------------------------------------------- //
export interface EventTypeSampleQueryPayload {
  name: string;
  id: string;
  type: string
}
export class EventTypeSampleQuery extends EventWithPayload<EventTypeSampleQueryPayload> {
  static readonly type = "EventTypeSampleQuery"
  public readonly type = EventTypeSampleQuery.type
}

/**
 * Event to use when requesting to add new Tab
 */
export class EventTypeAddTab extends EventWithPayload<EventTypeSampleQueryPayload> {
  static readonly type = "EventTypeAddTab"
  public readonly type = EventTypeAddTab.type
}

export class EventTypeCloseTab extends EventWithPayload<string> {
  static readonly type = "EventTypeCloseTab"
  public readonly type = EventTypeCloseTab.type
}

export class EventTypeCompileReply extends EventWithPayload<any> {
  static readonly type = "compile.reply"
  public readonly type = EventTypeCompileReply.type
}

export class EventTypeEvaluateReply extends EventWithPayload<any> {
  static readonly type = "evaluate.reply"
  public readonly type = EventTypeEvaluateReply.type
}

export class EventTypeEvaluateResult extends EventWithPayload<any> {
  static readonly type = "evaluate.result"
  public readonly type = EventTypeEvaluateResult.type
}

export class EventTypeEditorKeyDown extends EventWithPayload<any> {
  static readonly type = "editor.keydown"
  public readonly type = EventTypeEditorKeyDown.type
}

export class EventTypeLogEvent extends EventWithPayload<any> {
  static readonly type = "LogEvent"
  public readonly type = EventTypeLogEvent.type
}

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

/***
 * For convenience in our type annotations, we're going to export all of the Event
 * types as one type union. This way, our message bus event handler can use this type
 * in its signature and then narrow down the type using a discriminating union.
 */
export type EventTypes =
  EventTypeCompileReply |
  EventTypeEvaluateReply |
  EventTypeSampleQuery |
  EventTypeAddTab |
  EventTypeCloseTab |
  EventTypeEditorKeyDown |
  EventTypeLogEvent
  ;
