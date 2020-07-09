import ASTParser from "../ASTParser"
//import SourceGenerator from "../SourceGenerator";
import Utils from '../util'

import glob from 'glob'
import * as fs from 'fs'

test('basic', () => {
    // const ast = ASTParser.parse({ type: "code", value: ' let x ' });
    // const json = Utils.toJson(ast)
    // console.info(json)
    // options is optional
    const results = glob("./test/fixtures/ES6/**/*.js", { sync: true });

    function getType(name: string): string {
        return ['tree', 'tokens', 'path'].find(type => {
            const chunks = name.split('.')
            return (chunks.length == 3) ? type === chunks[1] : false
        })
    }

    for (const path of results) {
        console.info(path)
        const parts = path.split('/');
        const name = parts[parts.length - 1]
        const chunks = name.split('.')
        const type = getType(name)

        console.info(chunks)
        console.info(name)
        console.info(type)

        const content = fs.readFileSync(path, 'utf-8')
        console.info(content)
    }

    let dir = __dirname
    console.info(dir)
    // console.info(ast)
    // expect(sum()).toBe(0);
});

test('basic', () => {
    // const ast = ASTParser.parse({ type: "code", value: ' 1 '}); 
    // const json = Utils.toJson(ast)
    // console.info(json)
    // console.info(ast)
    // expect(sum()).toBe(0);
});

