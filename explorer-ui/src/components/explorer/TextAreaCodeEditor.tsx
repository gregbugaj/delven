import React, { RefObject, useLayoutEffect } from 'react'
import { CodeMirrorManager } from './CodeMirror'

interface TextAreaCodeEditorProps {
  name: string
  id: string
  value: string
  focus: boolean
  onKeyDown?: (instance: CodeMirror.Editor, event: KeyboardEvent) => void,
  onEditorReady?: (cme: CodeMirrorManager) => void,
  containerRef?: RefObject<HTMLDivElement>,
}



const TextAreaCodeEditor = React.memo((props: TextAreaCodeEditorProps) => {
  return TextAreaCodeEditorInner(props)
})

function TextAreaCodeEditorInner(props: TextAreaCodeEditorProps) {
  const { name, value, id, focus, onKeyDown, onEditorReady, ...other } = props;
  const ref = React.createRef<HTMLTextAreaElement>();
  let cme: CodeMirrorManager

  useLayoutEffect(() => {
    console.info(`TextAreaCodeEditor init : ${id}`)
    if (ref.current === null) {
      throw new Error('ref.current is null exptected HTMLTextArea')
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

    if (onEditorReady) {
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
