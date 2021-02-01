import { IQueryable } from "./IQueryable";
import { isNumber, isString } from "util";

/**
 * Sleep for a specific amount of time
 *
 * ```
 * let val = await sleep(1000)
 * ```
 * @param ms
 */
function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock object populator
 * @param index 
 * @param obj 
 */
export function populator(index: number, obj: any): any {
  const clone = Object.assign({}, obj); // same as clone = {...obj};
  const keys = Object.keys(clone);
  for (const key of keys) {
    if (isNumber(clone[key])) {
      clone[key] = index;
    } else if (isString(clone[key])) {
      clone[key] = `select-${index}`;
    }
  }
  return clone;
}

type TypeCreator<T> = (index: number) => T;

/**
 * Mock datasource provider
 */
export default class MockQuerySource<T> extends IQueryable<T> {
  count: number;
  sleeptime: number;
  creator: TypeCreator<T>;

  constructor(
    count: number = 0,
    sleeptime: number = 0,
    creator: TypeCreator<T>
  ) {
    super();
    console.info(`MockQuerySource row count : ${count}, ${sleeptime}`);

    this.count = count;
    this.sleeptime = sleeptime;
    this.creator = creator;
  }

  async *iterOfIter(): AsyncGenerator<T, unknown, unknown> {
    for (let i = 0; i < this.count; ++i) {
      await sleep(this.sleeptime);
      yield* this.iter();
    }
    return;
  }

  async *iter(): AsyncGenerator<T, unknown, unknown> {
    for (let i = 0; i < this.count; ++i) {
      await sleep(this.sleeptime);
      yield this.creator.apply(this, [i]);
    }

    return;
  }

  /**
   * Create a mock data source provider
   * @param count
   * @param timeout
   */
  static create<T>(
    count: number,
    sleeptime: number,
    creator: TypeCreator<T>
  ): MockQuerySource<T> {
    return new MockQuerySource<T>(count, sleeptime, creator);
  }
}
