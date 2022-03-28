import { ContainerModule, Container } from 'inversify';
import "reflect-metadata";


import { ILoggerServer, loggerPath, ConsoleLogger } from '../common/logger-protocol';
import { ILogger, Logger, LoggerFactory, setRootLogger, LoggerName, rootLoggerName } from "../common";
import { LoggerWatcher } from '../common/logger-watcher';
import { WebSocketConnectionProvider } from './messaging';
// import { FrontendApplicationContribution } from './frontend-application';

export const loggerFrontendModule = new ContainerModule(bind => {
    console.info(`Init : loggerFrontendModule : ${rootLoggerName}`)
    bind(LoggerName).toConstantValue(rootLoggerName);
    bind(ILogger).to(Logger).inSingletonScope();
    bind(LoggerWatcher).toSelf().inSingletonScope();
    bind(ILoggerServer).toDynamicValue(ctx => {
        console.info("ILoggerServer:toDynamicValue")
        const loggerWatcher = ctx.container.get(LoggerWatcher);
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<ILoggerServer>("/services/logger", loggerWatcher.getLoggerClient());
    }).inSingletonScope();

    bind(LoggerFactory).toFactory(ctx =>
        (name: string) => {
            console.info(`Injecting *** 3 :${name}`)

            const child = new Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            child.bind(ILogger).to(Logger).inTransientScope();
            child.bind(LoggerName).toConstantValue(name);
            return child.get(ILogger);
        }
    );
});
