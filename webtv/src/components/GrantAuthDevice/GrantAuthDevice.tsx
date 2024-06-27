import { UseOpenPassDeviceAuth } from "../../hooks/OpenPassDeviceAuth.hook";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  useDisclosure,
  Image,
  Heading,
  Box,
  Divider,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

type GrantAuthDeviceProps = {
  shouldOpen: boolean;
  onClosed: () => void;
};

const SignIn = ({
  deviceAuth,
  errorState = false,
}: {
  errorState: boolean;
  deviceAuth: { userCode?: string; verificationUriComplete?: string };
}) => {
  const getQRCodeURl = useMemo(() => {
    const qrQuery = `https://quickchart.io/qr?margin=1&text=${deviceAuth?.verificationUriComplete}`;

    return qrQuery;
  }, [deviceAuth]);

  return (
    <DrawerBody>
      <Box display="flex" position={"relative"}>
        <Box margin={"20px 0"}>
          {!errorState && (
            <>
              <Text fontSize="xl" fontWeight={"400"}>
                Scan this image using the camera on your phone to get a link
              </Text>
              <Text fontSize="xl" fontWeight={"bold"}>
                Or visit {deviceAuth?.verificationUriComplete} on a computer or
                mobile device.
              </Text>
            </>
          )}

          {errorState && (
            <>
              <Text fontSize="xl" fontWeight={"400"}>
                Seems the code has expired, please close and open this window
              </Text>
            </>
          )}
        </Box>

        {!errorState && (
          <Box margin={"0 auto"}>
            <Image alt="QR Code" src={getQRCodeURl} height={250}></Image>
            <Heading as="h2" size="lg" textAlign={"center"} pt={3}>
              {deviceAuth?.userCode}
            </Heading>
          </Box>
        )}
      </Box>
    </DrawerBody>
  );
};

const SignedIn = ({ user }: { user: any }) => {
  return (
    <>
      <Box
        w="full"
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"center"}
      >
        <Divider />
        <Text fontSize="2xl" marginTop={"20px"} fontWeight={"bold"}>
          Welcome {user?.idToken?.email}
        </Text>

        <Avatar
          name="User Avatar"
          height={"200px"}
          width={"200px"}
          margin={"15px 15px"}
          src="https://i.pravatar.cc/300"
        />
      </Box>
    </>
  );
};

const CodeDrawer = ({
  deviceAuth,
  user,
  errorState = false,
}: {
  errorState: boolean;
  deviceAuth: { userCode?: string; verificationUriComplete?: string };
  user: any;
}) => {
  return (
    <DrawerContent background={"#FFFFFF"} padding={"20px 20px"} color={"black"}>
      <DrawerCloseButton />
      <DrawerHeader paddingBottom={0}>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Image
            alt="StarFin"
            width={"287px"}
            height={"72px"}
            src={"images/starfin.png"}
          ></Image>
          <Divider
            margin={"0 20px"}
            orientation="vertical"
            style={{ border: "1px solid black", height: "50px" }}
          />
          <Image
            alt="OpenPass"
            width={"150px"}
            height={"30px"}
            src={"images/logo-openpass.png"}
          ></Image>
        </Box>
      </DrawerHeader>

      {user && <SignedIn user={user} />}
      {!user && <SignIn deviceAuth={deviceAuth} errorState={errorState} />}
    </DrawerContent>
  );
};
const GrantAuthDevice = ({ shouldOpen, onClosed }: GrantAuthDeviceProps) => {
  const [errorState, setErrorState] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deviceAuth } = UseOpenPassDeviceAuth({
    onError: (error) => {
      console.log(error)
      setErrorState(true);
      setCurrentUser(null);
    },
    onAuth: (data) => {
      if (data) {
        setCurrentUser(data);
      }
    },
  });

  useEffect(() => {
    if (shouldOpen) {
      onOpen();
    }
  }, [onOpen, shouldOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onClosed();
      }}
      placement="bottom"
      size={"xl"}
    >
      <DrawerOverlay />
      <CodeDrawer
        deviceAuth={deviceAuth}
        errorState={errorState}
        user={currentUser}
      />
    </Drawer>
  );
};

export default GrantAuthDevice;
