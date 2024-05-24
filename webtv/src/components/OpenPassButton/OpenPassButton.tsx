import { Button, Image } from "@chakra-ui/react";

type OpenPassButtonProps = {
  onClick: () => void;
};

const OpenPassIcon = () => (
  <Image alt="OpenPass Icon" src={"images/openpass_icon.png"} />
);

const OpenPassButton = ({ onClick }: OpenPassButtonProps) => (
  <Button
    id="OpenPassButton"
    leftIcon={<OpenPassIcon />}
    width={"320px"}
    height={"60px"}
    style={{ borderRadius: "20px", padding: "15px 15px", fontSize: "20px" }}
    onClick={onClick}
    _hover={{ border: "3px solid #4ef946" }}
    _active={{
      bg: "#dddfe2",
      transform: "scale(0.98)",
      border: "3px solid #4ef946",
    }}
  >
    Sign in with OpenPass
  </Button>
);

export default OpenPassButton;
