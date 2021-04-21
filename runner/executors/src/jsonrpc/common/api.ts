
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../../typings/thenable.d.ts" />

import {
	Message, RequestMessage, NotificationMessage
} from './messages';
import { Disposable } from '../common/disposable';

import { AbstractCancellationTokenSource, CancellationTokenSource, CancellationToken } from '../common/cancellation';
import { MessageReader, AbstractMessageReader, ReadableStreamMessageReader, DataCallback, MessageReaderOptions } from '../common/messageReader';
import { MessageWriter, AbstractMessageWriter, WriteableStreamMessageWriter, MessageWriterOptions } from '../common/messageWriter';

import {
	MessageConnection, createMessageConnection,
} from '../common/connection';

import RAL from './ral';


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
	Message, RequestMessage, NotificationMessage
}
