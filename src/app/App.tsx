import { TerminalProvider, ThemeProvider, GameProvider } from "@context";

interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: AppProps) => {
  return (
    <TerminalProvider>
      <ThemeProvider>
        <GameProvider>{children}</GameProvider>
      </ThemeProvider>
    </TerminalProvider>
  );
};

export default App;
