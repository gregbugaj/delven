import MockQuerySource, { populator } from "../../../query/MockQuerySource";

(async () => {
  // Query select

  `
  // source
  let x = select x, y from sourceA()    
  
  // Expected
  let x = From(source())
            .Select((row, index)=> {
                return {'x': row.x}
            })
  `;

  class Dynamic {
    val: number = 0;
  }

  const provider = MockQuerySource.create<Dynamic>(10, 0, (index) =>
    populator(index, new Dynamic())
  );

  for await (const val of provider) {
    console.info(`${Date.now()} : iter : ${JSON.stringify(val)}`);
  }
})();

