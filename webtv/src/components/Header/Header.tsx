import { UseStorageSession } from "@/hooks/UseStorageSession";
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
const Header = () => {
  const { storageSession } = UseStorageSession();

  return (
    <Flex w="full" justifyContent={"space-around"} zIndex={2} position={"relative"}>
      <Box w="full">
        <Image
          width={"320px"}
          height={"90px"}
          alt="StarFin"
          src="images/logo_starfin.png"
        ></Image>
      </Box>
      <Box
        w="full"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Text>{storageSession?.idToken?.email}</Text>

        <Avatar
          name="User Avatar"
          height={"40px"}
          width={"40px"}
          margin={"0 15px"}
          src="https://i.pravatar.cc/300"
        />
      </Box>
    </Flex>
  );
};

export default Header;
