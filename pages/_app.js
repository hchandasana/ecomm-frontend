import React from "react";
import Router, { useRouter } from "next/router";

// MUI
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// custom context
import theme from "components/materialTheme";
import NavigationLoader from "components/navigationLoader";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from "components/errorBoundary";

function MyApp({ Component, pageProps: { ...pageProps } }) {
  const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // navigational loader
  const [loading, setLoading] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState(null);


  React.useEffect(() => {
    // if (!storage) return;
    if (window) {
      const storage = window?.sessionStorage;

      if (storage) {
        // Set the current path value by looking at the browser's location object.

        if (currentRoute !== router.pathname) {
          const prevPath = storage.getItem("currentPath");
          storage.setItem("prevPath", prevPath);
          storage.setItem("currentPath", router.pathname);
          setCurrentRoute(router.pathname);
        }
      }
    }
    // Set the previous path as the value of the current path.
  }, [router]);

  React.useEffect(() => {
    const start = () => {
      setLoading(true);
    };

    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && <NavigationLoader />}
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
