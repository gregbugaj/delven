/**
 * Protocol definition based on JSON-RPC and standarized to be compliant with VS Language server
 * Long term goal is to have a VSCode plugin
 *
 * https://microsoft.github.io/language-server-protocol/specification
 */

type integer = number

interface Message {
  jsonrpc: string;
}

/**
 * To cancel a request, a notification message with the following properties is sent:
 * method: ‘$/cancelRequest’
 */
interface CancelParams {
	/**
	 * The request id to cancel.
	 */
	id: integer | string;
}

export { }
