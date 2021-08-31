/**
 * Options to use for the select query
 */
interface SelectQueryOptions {
    expressions: { expr: string }[]
}

/**
 * User query to execute
 */
export default class UserQuery {
    /**
     * Select query builder
     * @param options
     */
    static Select(options: SelectQueryOptions): UserSelectQuery {
        return new UserSelectQuery(options)
    }
}

export class UserSelectQuery {
    constructor(options: SelectQueryOptions) {
        console.info(`UserSelectQuery : ${JSON.stringify(options)}`)
    }
}

const Select = UserQuery.Select
export {Select}
