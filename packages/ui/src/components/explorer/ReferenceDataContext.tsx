import React from "react"

type Props = {
  children: React.ReactNode
};

type ThemeContextType = {
  theme: string;
  setTheme: (value: string) => void;
};

const defaultTheme = "white";
// const ThemeContext = React.createContext<ThemeContextType>(undefined!);

const [useThemeContext, CtxProvider] = createCtx<ThemeContextType>();

const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    const currentTheme = "lightblue";
    setTheme(currentTheme);
  }, []);

  return (
    <CtxProvider value={{ theme, setTheme }}>
      {children}
    </CtxProvider>
  );
}

function createCtx<ContextType>() {
  const ctx = React.createContext<ContextType | undefined>(undefined);

  function useCtx() {
    const c = React.useContext(ctx);
    if (!c)
      throw new Error(
        "useCtx must be inside a Provider with a value"
      );
    return c;
  }

  return [useCtx, ctx.Provider] as const;
}

export { useThemeContext, ThemeProvider };
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

