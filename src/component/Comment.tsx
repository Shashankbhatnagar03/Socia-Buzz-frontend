import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { ICommentProps } from "../types/types";

const Comment = ({ reply, lastReply }: ICommentProps) => {
  // const [liked , setLiked] = useState<boolean>(false);
  // const totalLikes:number = liked ? likes + 1 : likes;
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} name={reply.username} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}{" "}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
          {/* implement liking of comment to it  */}
          {/* <Icons liked={liked} setLiked={setLiked}/> */}
          {/* <Text fontSize={"sm"} color={"grey.light"} >
       {totalLikes}+{(totalLikes>0?" likes":" like")} 
        </Text> */}
        </Flex>
      </Flex>

      {!lastReply && <Divider />}
    </>
  );
};

export default Comment;
