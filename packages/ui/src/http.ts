// https://www.carlrippon.com/fetch-with-async-await-and-typescript/

/**
 *
 * @param request
 */
export async function http<T>(request: RequestInfo): Promise<T> {
    const response = await fetch(request)
    return await response.json();
}
