import { ContainerModule, Container } from 'inversify';
import 'reflect-metadata';

import { ILoggerServer, loggerPath, ConsoleLogger } from '../common/logger-protocol';
import { ILogger, Logger, LoggerFactory, setRootLogger, LoggerName, rootLoggerName } from '../common';
import { LoggerWatcher } from '../common/logger-watcher';
import { WebSocketConnectionProvider } from './messaging';
// import { FrontendApplicationContribution } from './frontend-application';


export const loggerFrontendModule = new ContainerModule(bind => {
  // bind(FrontendApplicationContribution).toDynamicValue(ctx => ({
  //   initialize(): void {
  //     setRootLogger(ctx.container.get<ILogger>(ILogger));
  //   }
  // }));

  bind(LoggerName).toConstantValue(rootLoggerName);
  bind(ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
  bind(LoggerWatcher).toSelf().inSingletonScope();
  bind(ILoggerServer).toDynamicValue(ctx => {
    const loggerWatcher = ctx.container.get(LoggerWatcher);
    const connection = ctx.container.get(WebSocketConnectionProvider);
    const target = connection.createProxy<ILoggerServer>(loggerPath, loggerWatcher.getLoggerClient());
    function get<K extends keyof ILoggerServer>(_: ILoggerServer, property: K): ILoggerServer[K] | ILoggerServer['log'] {
      console.info('FRONTEND: log ? : ' +property );
      if (property === 'log') {
        return (name, logLevel, message, params) => {
          ConsoleLogger.log(name, logLevel, message, params);
          return target.log(name, logLevel, message, params);
        };
      }
      return target[property];
    }
    return new Proxy(target, { get });
  }).inSingletonScope();
  bind(LoggerFactory).toFactory(ctx =>
    (name: string) => {
      const child = new Container({ defaultScope: 'Singleton' });
      child.parent = ctx.container;
      child.bind(ILogger).to(Logger).inTransientScope();
      child.bind(LoggerName).toConstantValue(name);
      return child.get(ILogger);
    }
  );
});


export const loggerFrontendModuleXXX = new ContainerModule(bind => {
  console.info(`Init : loggerFrontendModule : ${rootLoggerName}`);
  bind(LoggerName).toConstantValue(rootLoggerName);
  bind(ILogger).to(Logger).inSingletonScope();
  bind(LoggerWatcher).toSelf().inSingletonScope();

  bind(ILoggerServer)
    .toDynamicValue(ctx => {
      console.info('ILoggerServer:toDynamicValue');
      const loggerWatcher = ctx.container.get(LoggerWatcher);
      const connection = ctx.container.get(WebSocketConnectionProvider);
      let proxy = connection.createProxy<ILoggerServer>('/services/logger', loggerWatcher.getLoggerClient());
      console.info(proxy);
      return proxy;
    })
    .inSingletonScope();

  bind(LoggerFactory).toFactory(ctx => (name: string) => {
    console.info(`Injecting *** 3 : LoggerFactory : ${name}`);
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = ctx.container;
    child.bind(ILogger).to(Logger).inTransientScope();
    child.bind(LoggerName).toConstantValue(name);
    return child.get(ILogger);
  });
});
