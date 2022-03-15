import React from 'react';
import {useInjection} from './ioc.react';
import {IProvider} from './providers';
import {ILogger} from "./common";

export const HelloComponentWithInjection = () => {
    const provider = useInjection<IProvider<string>>('nameProvider');
    const logger = useInjection<ILogger>(ILogger);

    console.info(provider)
    console.info(logger)

    return (
        <h1>Hello from provider: {provider.provide()}!</h1>
    );
};
