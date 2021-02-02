import MockQuerySource from "../../../query/Queryable";

(async () => {
  const provider = MockQuerySource.create<number>(10, 100, (index) => index);

  for await (const val of provider) {
    console.info(`${Date.now()} : iter : ${JSON.stringify(val)}`);
  }
})();
