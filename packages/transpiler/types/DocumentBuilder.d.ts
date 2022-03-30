export interface Chunk {
    type: string;
    value?: string;
    parts?: Chunk[];
    parent?: Chunk;
    options?: ChunkOption;
}
export interface ChunkOption {
    flatGroup?: boolean;
    bracelessGroup?: boolean;
}
/**
 * Document builder for rendering transpilled source
 */
export default class DocumentBuilder {
    root: Chunk;
    current: Chunk;
    level: number;
    debug: boolean;
    constructor();
    push(options?: ChunkOption): void;
    pop(): void;
    write(txt: string): void;
    /**
     * Add indentation node
     */
    indent(): void;
    toSource(): string;
}
