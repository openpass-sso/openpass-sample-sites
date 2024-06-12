import { Box, Flex, Image, Text } from "@chakra-ui/react";
import OpenPassButton from "../OpenPassButton/OpenPassButton";
import { useEffect, useState } from "react";
import GrantAuthDevice from "../GrantAuthDevice/GrantAuthDevice";

const Welcome = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (event: KeyboardEvent) => {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      const OpenPassButton = document.getElementById("OpenPassButton");
      event.preventDefault();
      if (OpenPassButton) {
        OpenPassButton.focus();
      }
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleButtonClick);

    return () => {
      document.body.removeEventListener("keydown", handleButtonClick);
    };
  });

  return (
    <Box
      h="full"
      bgGradient="#FFFFFF"
      color={"white"}
    >
      <Flex h="full">
        <Box w="full" h="full">
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            flexDirection={"column"}
            height={"100%"}
            width={"50%"}
            margin={"0 auto"}
          >
            <Image
              width={"320px"}
              height={"150px"}
              alt="StarFin"
              src="images/thetradedesk.png"
            ></Image>
            <Text
              fontSize="4xl"
              fontWeight={"400"}
              margin={"50px 0"}
              textAlign={"center"}
            >
              Click to open the authentication flow!
            </Text>

            <OpenPassButton onClick={() => handleOnClick()} />
          </Box>
        </Box>

      </Flex>

      {isOpen && (
        <GrantAuthDevice
          shouldOpen={isOpen}
          onClosed={() => {
            setIsOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default Welcome;
