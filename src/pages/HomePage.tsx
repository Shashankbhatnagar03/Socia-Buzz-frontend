import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Link to={"/mark"}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}> visit Profile Page</Button>
      </Flex>
    </Link>
  );
};

export default HomePage;
