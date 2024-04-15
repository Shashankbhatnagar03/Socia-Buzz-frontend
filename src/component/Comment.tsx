import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import  { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Icons from "./Icons";

const Comment = () => {
    const [liked , setLiked] = useState<boolean>(false);

  return <>
  <Flex gap={4} py={2} my={2} w={"full"}>
  <Avatar src="/zuck-avatar.png" name="Zuckerberg" size={"sm"} />
    <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>

            <Text fontSize={"sm"} fontWeight={"bold"}>Username </Text>

            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"} color={"grey.light"}>1d</Text>
                <BsThreeDots />
            </Flex>
        </Flex>
        <Text>Hey this look great! </Text>
        <Icons liked={liked} setLiked={setLiked}/>
        <Text fontSize={"sm"} color={"grey.light"} >
            {100 + (liked ? 1:0)} likes
        </Text>
    </Flex>
  </Flex>
  
  <Divider />
  

  </>;
};

export default Comment;
