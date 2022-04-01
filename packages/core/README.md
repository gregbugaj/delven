
## Description

The `@delven/core` extension is the main extension for all Delven-Studio applications.


## Re-Exports Mechanism

In order to make application builds more stable `@delven/core` re-exports some common dependencies for Delven extensions to re-use. This is especially useful when having to re-use the same dependencies as `@delven/core` does: Since those dependencies will be pulled by Delven, instead of trying to match the same version in your own packages, you can use re-exports to consume it from the framework directly.

### Usage Example

Let's take inversify as an example since you will most likely use this package, you can import it by prefixing with `@delven/core/shared/`:

```js
import { injectable } from '@delven/core/shared/inversify';

@injectable()
export class SomeClass {
    // ...
}
```


### Ref

https://github.com/eclipse-theia/theia/blob/master/packages/core/README.md
