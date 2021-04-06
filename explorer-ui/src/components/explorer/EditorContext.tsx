import React, { useState } from "react"

// https://atomizedobjects.com/blog/react/how-to-use-usecontext-in-functional-components/
type Props = {
  children: React.ReactNode
};

export type IEditor = {
  name: string;
  id: number;
};

interface IEditorContext {
  editors: IEditor[];
}

const EditorContext = React.createContext<IEditorContext>({ editors: [] });

// const EditorContext = React.createContext<IEditorContext>([[], () => { }]);

const EditorProvider = ({ children }: Props) => {
  const [editors, setEditors] = useState<IEditor[]>([
    {
      name: 'name A',
      id: 1,
    }, {
      name: 'name B',
      id: 2,
    }, {
      name: 'name C',
      id: 3,
    },
  ]);

  const context = {
    editors: editors,
    setEditors: setEditors,
  };

  return (
    // <EditorContext.Provider value={[editors, setEditors]}>
    <EditorContext.Provider value={context}>
      {children}
    </EditorContext.Provider>
  );
}

export { EditorContext, EditorProvider };

/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
function createCtx<A extends {} | null>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}


// export { ThemeContext, ThemeProvider };

// const ReferenceDataContext = React.createContext("GREG-ENG")

// type IMovie = {
//   original_title: string;
//   poster_path: string;
//   id: number;
// };

// type IMovieContext = [IMovie[], React.Dispatch<React.SetStateAction<IMovie[]>>];

// const MovieContext = React.createContext<IMovieContext>([[], () => null]);

// const MovieProvider = props => {
//   const [movies, setMovies] = useState<IMovie[]>([
//     {
//       original_title: 'name of movie',
//       poster_path: 'path_to_poster',
//       id: 1,
//     },
//   ]);
//   return <MovieContext.Provider value={[movies, setMovies]}>{props.children}</MovieContext.Provider>;
// };

// export { MovieContext, MovieProvider };




/**

export type IEditor = {
  name: string;
  id: number;
};


type UpdateType = React.Dispatch<React.SetStateAction<IEditor[]>>;
const defaultUpdate: UpdateType = () => [];

type IEditorContext = [IEditor[], React.Dispatch<React.SetStateAction<IEditor[]>>];
const EditorContext = React.createContext<IEditorContext>([[], defaultUpdate]);
// const EditorContext = React.createContext<IEditorContext>([[], () => { }]);

const EditorProvider = ({ children }: Props) => {
  const [editors, setEditors] = useState<IEditor[]>([
    {
      name: 'name A',
      id: 1,
    }, {
      name: 'name B',
      id: 2,
    }, {
      name: 'name C',
      id: 3,
    },
  ]);

  return (
    // <EditorContext.Provider value={[editors, setEditors]}>
    <EditorContext.Provider value={[editors, setEditors]}>
      {children}
    </EditorContext.Provider>
  );
}
 */
