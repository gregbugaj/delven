import React from 'react';
import {useInjection} from './ioc.react';
import {IProvider} from './providers';
import {ILogger, Logger} from "./common";

// @inject(MessageService)
// protected readonly messageService: MessageService;
//
// @inject(ILogger)
// protected readonly logger: ILogger;

export const Hello = () => {
    const provider = useInjection<IProvider<string>>('nameProvider');
    const logger = useInjection<ILogger>(ILogger);

    console.info(provider)
    console.info(logger)

    return (
        <h1>Hello from provider: {provider.provide()}!</h1>
    );
};
