/**
 * Provides functionality to evaluate queries against a specific data source
 * 
 * Much of the API has been driven the original LINQ implementation
 * 
 * https://github.com/microsoft/TypeScript/issues/25710
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 * https://docs.microsoft.com/en-us/dotnet/api/system.linq.iqueryable-1
 */

import { IEnumerable } from "./IEnumerable";

export abstract class IQueryable<T> extends IEnumerable<T> {

}
