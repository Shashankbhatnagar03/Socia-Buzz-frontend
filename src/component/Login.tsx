import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import {
  Alignment,
  Fit,
  Layout,
  RiveState,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-canvas";
import userAtom from "../atoms/userAtom";

export default function Login() {
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
  const isLoginFailInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "login_fail"
  );
  const onLoginFailActivate = useCallback(() => {
    if (rive && isLoginFailInput) {
      isLoginFailInput.fire();
    }
  }, [rive, isLoginFailInput]);
  const isLoginSuccessInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "login_success"
  );
  const onLoginSuccessActivate = useCallback(() => {
    if (rive && isLoginSuccessInput) {
      isLoginSuccessInput.fire();
    }
  }, [rive, isLoginSuccessInput]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const toast = useShowToast();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const handlelogin = async () => {
    try {
      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      // console.log(data);
      if (data.error) {
        onLoginFailActivate();
        toast("Error", data.error, "error");

        return;
      }

      onLoginSuccessActivate();
      setTimeout(() => {
        localStorage.setItem("user-info", JSON.stringify(data));
        setUser(data);
      }, 2000);
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    }
  };
  return (
    <Flex justify={"center"}>
      <Stack>
        <Stack maxW={"lg"} mt={0} align={"center"}>
          <Heading fontSize={"4xl"} pt={6} textAlign={"center"}>
            Welcome Back!
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
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
                onFocus={onFocusActivate}
                onBlur={onFocusDeactivate}
                placeholder="Enter your Username"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                  onFocus={onPasswordActivate}
                  onBlur={onPasswordDeactivate}
                  placeholder="Enter your Password"
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handlelogin}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    setAuthScreen("signup");
                  }}
                >
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
