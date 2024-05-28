import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alignment,
  Fit,
  Layout,
  RiveState,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-canvas";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function Signup() {
  const STATE_MACHINE_NAME = "State Machine 1";
  const { rive, RiveComponent }: RiveState = useRive({
    src: "/bunny_login.riv",
    stateMachines: [STATE_MACHINE_NAME],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Fill, // Ensure the animation fills the container
      alignment: Alignment.Center,
    }),
  });
  const isPasswordInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "IsPassword"
  );
  const isFocusInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isFocus"
  );

  const onPasswordActivate = useCallback(() => {
    if (rive && isPasswordInput) {
      isPasswordInput.value = true;
    }
  }, [rive, isPasswordInput]);
  const onPasswordDeactivate = useCallback(() => {
    if (rive && isPasswordInput) {
      isPasswordInput.value = false;
    }
  }, [rive, isPasswordInput]);

  const onFocusActivate = useCallback(() => {
    if (rive && isFocusInput) {
      isFocusInput.value = true;
    }
  }, [rive, isFocusInput]);
  const onFocusDeactivate = useCallback(() => {
    if (rive && isFocusInput) {
      isFocusInput.value = false;
    }
  }, [rive, isFocusInput]);

  const isSignupSuccessInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "login_success"
  );
  const onSignupSuccessActivate = useCallback(() => {
    if (rive && isSignupSuccessInput) {
      isSignupSuccessInput.fire();
    }
  }, [rive, isSignupSuccessInput]);
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const toast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleSignup = async () => {
    try {
      const res = await fetch(
        "https://sociabuzz-backend.onrender.com/api/v1/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        }
      );
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }

      onSignupSuccessActivate();
      setTimeout(() => {
        localStorage.setItem("user-info", JSON.stringify(data));
        setUser(data);
      }, 2000);
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    }
  };

  return (
    <>
      <Flex justify={"center"}>
        <Stack>
          <Stack maxW={"lg"} mt={0} align={"center"}>
            <Heading fontSize={"4xl"} pt={6} textAlign={"center"}>
              Welcome User
            </Heading>
          </Stack>
          <Stack align={"center"} verticalAlign={"center"}>
            <div className="RiveContainer">
              <RiveComponent />
            </div>
          </Stack>

          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "grey.dark")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={2}>
              <HStack>
                <Box>
                  <FormControl id="fullName" isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, name: e.target.value })
                      }
                      value={inputs.name}
                      onFocus={onFocusActivate}
                      onBlur={onFocusDeactivate}
                      placeholder="Enter your Full Name "
                      maxLength={40}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="userName" isRequired>
                    <FormLabel>User Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, username: e.target.value })
                      }
                      value={inputs.username}
                      onFocus={onFocusActivate}
                      onBlur={onFocusDeactivate}
                      placeholder="Enter your Username"
                      maxLength={20}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                  value={inputs.email}
                  onFocus={onFocusActivate}
                  onBlur={onFocusDeactivate}
                  placeholder="Enter your Email"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    onFocus={onPasswordActivate}
                    onBlur={onPasswordDeactivate}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                    value={inputs.password}
                    placeholder="Enter your Password (minimum 6 character)"
                    maxLength={20}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  onClick={handleSignup}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={2}>
                <Text align={"center"}>
                  Already a User?{" "}
                  <Link
                    color={"blue.400"}
                    ml={1}
                    onClick={() => {
                      setAuthScreen("login");
                    }}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
