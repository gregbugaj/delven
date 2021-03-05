/**
 * Options to use for the select query
 */
interface SelectQueryOptions {
    expressions: {
        expr: string;
    }[];
}
/**
 * User query to execute
 */
export default class UserQuery {
    /**
     * Select query builder
     * @param options
     */
    static Select(options: SelectQueryOptions): UserSelectQuery;
}
export declare class UserSelectQuery {
    constructor(options: SelectQueryOptions);
}
declare const Select: typeof UserQuery.Select;
export { Select };
