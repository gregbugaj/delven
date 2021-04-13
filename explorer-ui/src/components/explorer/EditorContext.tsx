import React, { useState } from "react"

// https://atomizedobjects.com/blog/react/how-to-use-usecontext-in-functional-components/
type Props = {
  children: React.ReactNode
};

export interface IEditor {
  name: string;
  id: string;
};

export type ISession = {
  name: string;
  editors: IEditor[]
};

const initialState: ISession = {
  name: `Session : ${Date.now()}`,
  editors: []
};

type SessionContext = [ISession, React.Dispatch<React.SetStateAction<ISession>>]
const EditorContext = React.createContext<SessionContext>([initialState, () => { }]);

const EditorProvider = ({ children }: Props) => {
  const [session, setSession] = useState<ISession>(initialState)

  return (
    <EditorContext.Provider value={[session, setSession]} >
      {children}
    </EditorContext.Provider>
  );
}

export { EditorContext, EditorProvider };
