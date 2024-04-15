import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import  { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Icons from "./Icons";
interface CommentProps{
    comment : string , 
    createdAt:number ,
    likes :number,
    username : string ,
    userAvatar:string
}

const Comment = ({comment , createdAt, likes , username ,userAvatar}:CommentProps) => {
    const [liked , setLiked] = useState<boolean>(false);
    const totalLikes:number = liked ? likes + 1 : likes;
  return <>
  <Flex gap={4} py={2} my={2} w={"full"}>
  <Avatar src={userAvatar} name={username} size={"sm"} />
    <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>

            <Text fontSize={"sm"} fontWeight={"bold"}>{username} </Text>

            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"} color={"grey.light"}>{createdAt}d</Text>
                <BsThreeDots />
            </Flex>
        </Flex>
        <Text>{comment}</Text>
        <Icons liked={liked} setLiked={setLiked}/>
        <Text fontSize={"sm"} color={"grey.light"} >
       {totalLikes}+{(totalLikes>0?" likes":" like")} 
        </Text>
    </Flex>
  </Flex>
  
  <Divider />
  

  </>;
};

export default Comment;
