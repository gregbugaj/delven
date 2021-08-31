
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/thenable.d.ts" />

import {
	Message, RequestMessage, NotificationMessage,RequestType, RequestType0, RequestType1, ProgressType,
	NotificationType, NotificationType0, NotificationType1,ResponseMessage, ParameterStructures, _EM
} from './messages';
import { Disposable } from '../common/disposable';

import { AbstractCancellationTokenSource, CancellationTokenSource, CancellationToken } from '../common/cancellation';
import { MessageReader, AbstractMessageReader, ReadableStreamMessageReader, DataCallback, MessageReaderOptions } from '../common/messageReader';
import { MessageWriter, AbstractMessageWriter, WriteableStreamMessageWriter, MessageWriterOptions } from '../common/messageWriter';

import {
	MessageConnection, createMessageConnection,Logger, ConnectionStrategy, ConnectionOptions, NullLogger,
} from '../common/connection';

import RAL from './ral';
import { Emitter, Event } from './events';


export {
	RAL,
	// Export from disposable
	Disposable,

	// Export from cancellation
	AbstractCancellationTokenSource, CancellationTokenSource, CancellationToken,

	// Export from message reader
	MessageReader, AbstractMessageReader, ReadableStreamMessageReader, DataCallback, MessageReaderOptions,
	// Export from message write
	MessageWriter, AbstractMessageWriter, WriteableStreamMessageWriter, MessageWriterOptions,

	//
	MessageConnection, createMessageConnection,

	// Message Protocol
	Message, RequestMessage, NotificationMessage,RequestType, RequestType0, RequestType1,ProgressType,
	NotificationType, NotificationType0, NotificationType1,ResponseMessage, ParameterStructures, _EM,

	// Emitter
	Emitter, Event,
	// Export from connection
	Logger, NullLogger, ConnectionStrategy, ConnectionOptions,
}
