import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { mode } from "@chakra-ui/theme-tools";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.tsx";

const styles = {
  global: (props: any) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  grey: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};
const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
