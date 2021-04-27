import { RequestType, RequestType0, NotificationType, NotificationType0, ProgressType, _EM, ParameterStructures } from 'delven-jsonrpc';

export class RegistrationType<RO> {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly ____: [RO, _EM] | undefined;

	public readonly method: string;
	public constructor(method: string) {
		this.method = method;
	}
}

export class ProtocolRequestType<P, R, PR, E, RO> extends RequestType<P, R, E> implements ProgressType<PR>, RegistrationType<RO> {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly ___: [PR, RO, _EM] | undefined;
	public readonly ____: [RO, _EM] | undefined;
	public readonly _pr: PR | undefined;

	public constructor(method: string) {
		super(method, ParameterStructures.byName);
	}
}