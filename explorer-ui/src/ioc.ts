import {Container} from 'inversify';
import "reflect-metadata";

import {IProvider, NameProvider} from './providers';

import {loggerFrontendModule} from "./browser/logger-frontend-module";
import {messagingFrontendModule} from "./browser/messaging/messaging-frontend-module";
import { ILogger, Logger, LogLevel } from "./common";
import { WebSocketConnectionProvider } from "./browser";

console.info("Bootstrapping IOC")
export const container = new Container();
container.bind<IProvider<string>>('nameProvider').to(NameProvider);

// load exported modules
container.load(messagingFrontendModule)
container.load(loggerFrontendModule)

let message = container.get<WebSocketConnectionProvider>(WebSocketConnectionProvider)
console.info(message)

// https://github.com/inversify/InversifyJS/issues/475
console.warn(container)
let logger = container.get<ILogger>(ILogger)
console.info(logger)
let level =  logger.getLogLevel();
console.info(level)
logger.log(LogLevel.INFO,  "This is a test")


async function bootstrapAsync() {
  console.info('Async bootstrap')
}

(async () => await bootstrapAsync())();
