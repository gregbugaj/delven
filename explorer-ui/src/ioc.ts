import {Container} from 'inversify';
import {IProvider, NameProvider} from './providers';

import {loggerFrontendModule} from "./browser/logger-frontend-module";
import {messagingFrontendModule} from "./browser/messaging/messaging-frontend-module";

export const container = new Container();
container.bind<IProvider<string>>('nameProvider').to(NameProvider);

// load exported modules
container.load(messagingFrontendModule)
container.load(loggerFrontendModule)

