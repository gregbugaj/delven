// https://stackoverflow.com/questions/55685029/codemirror-with-vanilla-typescript-and-webpack/55740925#55740925
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import '../../styles/_codemirror.css';

export class CodeMirrorManager {

    public editor: CodeMirror.Editor;

    config: CodeMirror.EditorConfiguration = {
        tabSize: 3,
        lineNumbers: true,
        mode: 'javascript',
    };

    // CTOR
    constructor(private readonly tagElement: HTMLTextAreaElement) {
        this.editor = CodeMirror.fromTextArea(this.tagElement, this.config);
    }
}