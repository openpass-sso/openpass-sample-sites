import React from "react";
import OpePass from "./components/_app/OpenPass";
import Welcome from "./components/Welcome/Welcome";

const Index = () => {
  return <Welcome />;
};

export const MyOpenPassApp = () => {
  return (
    <OpePass>
        <Index />
    </OpePass>
  );
};

export default MyOpenPassApp;
