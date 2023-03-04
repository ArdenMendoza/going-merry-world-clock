import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/muiTheme";
import createEmotionCache from "../utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: AppProps & { emotionCache: EmotionCache }) {
  return <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>

      <Component {...pageProps} />
    </ThemeProvider>
  </CacheProvider>
}

export default MyApp
