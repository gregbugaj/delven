import {Container} from 'inversify';
import {IProvider, NameProvider} from './providers';

import {loggerFrontendModule} from "./browser/logger-frontend-module";
import {messagingFrontendModule} from "./browser/messaging/messaging-frontend-module";
import { ILogger } from './common/logger';
import { WebSocketConnectionProvider } from './browser/messaging';

export const container = new Container();
container.bind<IProvider<string>>('nameProvider').to(NameProvider);

// load exported modules
// container.load(messagingFrontendModule)
container.load(loggerFrontendModule)

console.info(loggerFrontendModule)
// let message = container.get<WebSocketConnectionProvider>(WebSocketConnectionProvider)
// console.info(message)
let logger = container.get<ILogger>(ILogger)
console.info(logger)
