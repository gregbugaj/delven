import React from 'react';
import {useInjection} from './ioc.react';
import {IProvider} from './providers';
import {ILogger, LogLevel} from "./common";

export const HelloComponentWithInjection = () => {
    const provider = useInjection<IProvider<string>>('nameProvider');
    const logger = useInjection<ILogger>(ILogger);

    console.info(logger)
    logger.log(LogLevel.INFO, "Test From INJECTED LOGGER")
    logger.log(LogLevel.DEBUG, "Test From INJECTED LOGGER")
    logger.log(LogLevel.ERROR, "Test From INJECTED LOGGER")
    logger.log(LogLevel.FATAL, "Test From INJECTED LOGGER")

    /*
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
     */
    return (
        <h1>Hello from provider XX: {provider.provide()}!</h1>
    );
};
