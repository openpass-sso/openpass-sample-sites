import { AUTH_SESSION_KEY } from "@/constants/auth.constants";
import { useLocalStorage } from "@/hooks/LocalStorage.hook";
import { UseOpenPassDeviceAuth } from "@/hooks/OpenPassDeviceAuth.hook";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
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
    const _userCode = deviceAuth?.userCode;
    const _path = `https://myopenpass.com/code?user_code=${_userCode}`;
    const qrQuery = `https://quickchart.io/qr?margin=1&text=${_path}`;

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

const SignedIn = () => {
  return <></>;
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
            width={"250px"}
            height={"115px"}
            src={"images/thetradedesk.png"}
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

      {user && <SignedIn />}
      {!user && <SignIn deviceAuth={deviceAuth} errorState={errorState} />}
    </DrawerContent>
  );
};
const GrantAuthDevice = ({ shouldOpen, onClosed }: GrantAuthDeviceProps) => {
  const [errorState, setErrorState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useState<any>(null);
  const { GetFromKey } = useLocalStorage();

  const { deviceAuth } = UseOpenPassDeviceAuth({
    onError: () => {
      setErrorState(true);
    },
    onAuth: () => {
      const data = GetFromKey(AUTH_SESSION_KEY);
      if (data) {
        setUser(data);
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
      <CodeDrawer deviceAuth={deviceAuth} errorState={errorState} user={user} />
    </Drawer>
  );
};

export default GrantAuthDevice;
