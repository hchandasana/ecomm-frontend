import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import theme from "components/materialTheme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="robots" content="nofollow, noindex" />

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,900&display=swap"
          />
          <script></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => <App {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
    ],
  };
};
