import { extendTheme } from "@chakra-ui/react";

export type AlertOptions =
  | "error"
  | "warning"
  | "info"
  | "success"
  | "loading"
  | undefined;

const customScoutTheme = {
  fonts: {
    heading: `'Montserrat Variable', sans-serif`,
    body: `'Montserrat Variable', sans-serif`,
  },
  components: {
    Table: {
      variants: {
        caring: {
          tr: {
            _odd: {
              background: "white",
            },
          },
        },
        "caring-gray": {
          tr: {
            _even: {
              background: "gray.75",
            },
          },
        },
      },
    },
  },
  colors: {
    gray: {
      "75": "#f5f5f5",
    },
  },
};

const theme = extendTheme({}, customScoutTheme);

export default theme;
