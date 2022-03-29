import MockQuerySource, {populator} from "../../../query/Queryable"
;(async () => {
    class Dynamic {
        val: number = 0
    }

    const provider = MockQuerySource.create<Dynamic>(10, 100, index => populator(index, new Dynamic()))

    for await (const val of provider) {
        console.info(`${Date.now()} : iter : ${JSON.stringify(val)}`)
    }
})()
