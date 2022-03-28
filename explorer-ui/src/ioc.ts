import {Container} from 'inversify';
import "reflect-metadata";

import {IProvider, NameProvider} from './providers';

import {loggerFrontendModule} from "./browser/logger-frontend-module";
import {messagingFrontendModule} from "./browser/messaging/messaging-frontend-module";
import { ILogger } from './common/logger';
import { WebSocketConnectionProvider } from './browser/messaging';
import { loggerBackendModule } from "./node/logger-backend-module";

console.info("Bootstrapping IOC")
export const container = new Container();
container.bind<IProvider<string>>('nameProvider').to(NameProvider);

// load exported modules
// container.load(loggerBackendModule)
container.load(loggerFrontendModule)
container.load(messagingFrontendModule)


console.info(loggerFrontendModule)

// let message = container.get<WebSocketConnectionProvider>(WebSocketConnectionProvider)
// console.info(message)
let logger = container.get<ILogger>(ILogger)
console.info(logger)

logger.info("message from logger ----")
