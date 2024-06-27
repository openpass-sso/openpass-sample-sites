import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../lib/chakra/default-theme";

interface Props {
  children: React.ReactNode;
  pageProps?: { dehydratedState?: unknown };
}

const OpePass: React.FC<Props> = ({ children, pageProps }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default OpePass;
