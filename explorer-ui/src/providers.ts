import { injectable } from 'inversify';
import 'reflect-metadata';

export interface IProvider<T> {
    provide(): T;
}

@injectable()
export class NameProvider implements IProvider<string> {
    provide() {
        return 'World';
    }
}