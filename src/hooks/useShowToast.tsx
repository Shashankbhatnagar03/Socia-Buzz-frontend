import { useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = (
    title: string,
    description: string,
    status: "info" | "warning" | "success" | "error" | "loading" | undefined
  ) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };
  return showToast;
};

export default useShowToast;
