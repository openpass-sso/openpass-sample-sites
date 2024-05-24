import React from "react";
import OpePass from "@/components/_app/OpenPass";
import { AppProps } from "next/app";
import "@/styles/base.css";

const MyOpenPassApp = ({ Component, pageProps }: AppProps) => {
  return (
    <OpePass pageProps={pageProps}>
      <Component {...pageProps} />
    </OpePass>
  );
};

export default MyOpenPassApp;
