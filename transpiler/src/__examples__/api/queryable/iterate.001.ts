import MockQuerySource from "../../../query/queryable/Queryable"
;(async () => {
    const provider = MockQuerySource.create<number>(10, 100, index => index)

    for await (const val of provider) {
        console.info(`${Date.now()} : iter : ${JSON.stringify(val)}`)
    }
})()
