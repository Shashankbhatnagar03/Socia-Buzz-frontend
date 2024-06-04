import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useRef, useState } from "react";

const SettingsPage = () => {
  const headingColor = useColorModeValue("teal.800", "teal.200");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const toast = useShowToast();
  const logout = useLogout();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef(null);
  const freezeAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://sociabuzz-backend.onrender.com/api/v1/users/freeze",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        toast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box my={6} p={6} mx={7}>
        <Heading my={3} size="lg" fontWeight="semibold" color={headingColor}>
          Freeze Your Account
        </Heading>
        <Text my={3} fontSize="md" color={textColor} lineHeight="tall">
          You can unfreeze your account anytime by logging in.
        </Text>
        <Button
          size="lg"
          colorScheme={"red"}
          variant="outline"
          onClick={onOpen}
        >
          Freeze
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Freeze Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={freezeAccount}
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SettingsPage;
