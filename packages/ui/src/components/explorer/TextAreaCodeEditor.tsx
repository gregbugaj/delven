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
    if (ref.current === null) {
      throw new Error('ref.current is null expected HTMLTextArea')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    cme = new CodeMirrorManager(ref.current)
    if (onKeyDown) {
      cme.editor.on("keydown", (cm, change) => {
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
