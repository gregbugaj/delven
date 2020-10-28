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
  level = 0;
  debug = false;

  constructor() {
    this.root = {
      type: "root",
      parts: [],
    };

    this.current = this.root;
  }

  push(options?: ChunkOption) {
    this.level++;

    const node = {
      type: "group",
      parts: [],
      parent: this.current,
      options: options,
    };

    if (this.current.parts == undefined) {
      this.current.parts = [];
    }

    this.current.parts.push(node);
    this.current = node;

    if (this.debug) {
      console.info(`${this.level}  : push `);
    }
  }

  pop() {
    this.level--;
    if (this.current.parent) {
      this.current = this.current.parent;
    } else {
      this.root = this.current;
    }

    if (this.debug) {
      console.info(`${this.level}  : pop `);
    }
  }

  write(txt: string) {
    if (this.current.parts == undefined) {
      this.current.parts = [];
    }

    if (this.debug) {
      let pad = "";
      for (let i = 0; i < this.level; ++i) {
        pad += "  ";
      }

      console.info(`${this.level}  : write >   ${pad} ${txt}`);
    }
    this.current.parts?.push({ type: "txt", value: txt });
  }

  /**
   * Add indentation node
   */
  indent() {
    this.current.parts?.push({ type: "indent" });
  }

  toSource() {
    console.info("---- Builder source ----");
    const _pad = (count: number, indent = "  ") => {
      return indent.repeat(count);
    };

    let buffer = "";
    const printToBuffer = (node: Chunk, depth: number) => {
      //   console.info(`${depth} : ${node.type}   > ${node.parts?.length}`);
      let isGrouped = node.type === "group";
      let isFlat = node.options?.flatGroup ? node.options?.flatGroup : false;
      let isBracelessGroup = node.options?.bracelessGroup
        ? node.options?.bracelessGroup
        : false;

      if (false) {
        console.info(
          `isGrouped = ${isGrouped} , isFlat = ${isFlat}, isBracelessGroup = ${isBracelessGroup}`
        );
      }
      console.info(` --- val  ${node.type} = ${node?.value}`);
      if (node.type === "txt") {
        buffer += node?.value;
      } else if (node.type === "indent") {
        buffer += _pad(depth);
      } else if (node.parts) {
        let len = node.parts.length;
        if (len == 2 && isFlat) {
          buffer += "{}";
        } else {
          let d = depth;
          if (node.type === "group") {
            d = ++depth;
          }

          for (let i = 0; i < len; ++i) {
            let part = node.parts[i];
            let txt = part?.value;
            //   console.info(`     type == ${part.type}   :: ${part?.value}`);
            if (isGrouped && isBracelessGroup == false) {
              if (i == 0) {
                if (!isFlat) {
                  buffer += "\n";
                  buffer += _pad(d - 1);
                }
                buffer += txt;
                continue;
              } else if (i == len - 1) {
                buffer += "\n";
                buffer += _pad(d - 1);
                buffer += txt;
                continue;
              }
              // this will fall
            } else if (isGrouped && isBracelessGroup) {
              //  console.info(JSON.stringifyOnce(part));
              if (i == 0) {
                buffer += _pad(d + 1);
              } else if (i == len - 1) {
                buffer += _pad(d);
              }
            }
            printToBuffer(part, d);
          }
        }
      }
    };

    if (this.debug) {
      console.info(JSON.stringifyOnce(this.root));
      console.info("-------------------------");
    }

    printToBuffer(this.root, 0);
    return buffer;
  }
}
