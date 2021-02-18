// https://stackoverflow.com/questions/55685029/codemirror-with-vanilla-typescript-and-webpack/55740925#55740925
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/monokai.css';

import 'codemirror/mode/javascript/javascript';
import '../../styles/_codemirror.css';

export class CodeMirrorManager {

    public editor: CodeMirror.Editor;

    config: CodeMirror.EditorConfiguration = {
        tabSize: 3,
        lineNumbers: true,
        fixedGutter: true,
        mode: { name: "javascript", json: true },
        // theme:'monokai'
    };

    // CTOR
    constructor(private readonly tagElement: HTMLTextAreaElement) {
        this.editor = CodeMirror.fromTextArea(this.tagElement, this.config);
    }

    setValue(text: string) {
        this.editor.setValue(text)
        this.editor.refresh()
    }

    refresh() {
        this.editor.refresh()
    }

    getValue() {
        return this.editor.getValue()
    }
}