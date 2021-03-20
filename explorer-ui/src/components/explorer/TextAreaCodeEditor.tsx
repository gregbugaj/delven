import { DOMEvent } from 'codemirror';
import React, { useMemo, useLayoutEffect } from 'react'
import { CodeMirrorManager } from './CodeMirror'

interface TextAreaCodeEditorProps {
  name: string
  id: string
  value: string
  focus: boolean
  onKeyDown?: (instance: CodeMirror.Editor, event: KeyboardEvent) => void,
  onEditorReady?: (cme: CodeMirrorManager) => void,
}

const TextAreaCodeEditor = React.memo((props: TextAreaCodeEditorProps) => {
  return TextAreaCodeEditorInner(props)
})

function TextAreaCodeEditorInner(props: TextAreaCodeEditorProps) {
  const { name, value, id, focus, onKeyDown, onEditorReady, ...other } = props;

  let ref = React.createRef<HTMLTextAreaElement>();
  let cme: CodeMirrorManager

  useLayoutEffect(() => {
    console.info('TextAreaCodeEditor init ')
    console.info(ref.current)
    if (ref.current == null) {
      return
    }

    cme = new CodeMirrorManager(ref.current)
    if (onKeyDown) {
      cme.editor.on("keydown", (cm, change) => {
        // console.log("something changed xx ");
        // console.log(change)
        // let cursor = cm.getCursor()
        // console.log(cursor)
        onKeyDown(cm, change)
      });
    }

    if(onEditorReady){
      console.info('Firing : ' + onEditorReady)
      onEditorReady(cme)
    }
  }, [])

  return (
    <textarea
      ref={ref}
      name={name}
      id={id}
      defaultValue={value}
      autoComplete="off"
      autoFocus={focus}
    />
  )
}

export default TextAreaCodeEditor
