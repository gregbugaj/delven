// https://stackoverflow.com/questions/55685029/codemirror-with-vanilla-typescript-and-webpack/55740925#55740925
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/monokai.css';

import 'codemirror/mode/javascript/javascript';
import '../../styles/_codemirror.css';

// https://stackoverflow.com/questions/29291024/codemirror-onkeyevent-not-firing
export class CodeMirrorManager {

    public editor: CodeMirror.Editor;

    config: CodeMirror.EditorConfiguration = {
        tabSize: 4,
        // gutters: ["note-gutter", "CodeMirror-linenumbers"],
        lineNumbers: true,
        fixedGutter: true,
        mode: { name: "javascript", json: true },
        // scrollbarStyle:'native',
        // theme:'darcula',
        onKeyEvent: function(editor, event){
            console.info(`key ` + event)
            return true
        }
    };

    // CTOR
    constructor(private readonly tagElement: HTMLTextAreaElement) {
        this.editor = CodeMirror.fromTextArea(this.tagElement, this.config);
        // keypress  mousedown
        this.editor.on("keydown" , (cm, change)=> {
          console.log("something changed!");
          console.log(change)
          let cursor  = cm.getCursor()
          console.log(cursor)
        });
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
