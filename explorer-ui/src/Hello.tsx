import React from 'react';
import {useInjection} from './ioc.react';
import {IProvider} from './providers';
import {ILogger, LogLevel} from "./common";

export const HelloComponentWithInjection = () => {
    const provider = useInjection<IProvider<string>>('nameProvider');
    // const logger = useInjection<ILogger>(ILogger);

    console.info(provider)
    // console.info(logger)
    // logger.log(LogLevel.INFO, "Test From INJECTED LOGGER")

    return (
        <h1>Hello from provider XX: {provider.provide()}!</h1>
    );
};
