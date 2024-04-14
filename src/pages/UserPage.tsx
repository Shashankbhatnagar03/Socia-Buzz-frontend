import UserHeader from "../component/UserHeader"
import UserPost from "../component/UserPost"



const UserPage = () => {
  return <>
  <UserHeader/>
  <UserPost likes={1200} replies={222} postImg="/post1.png" postTitle="Zukerberg lost 1.5 million" />
  <UserPost likes={222} replies={12} postImg="/post1.png" postTitle="Zxyzyzy" />
  <UserPost likes={12132} replies={1122} postImg="/post1.png" postTitle="cncmccmc c" />
  <UserPost likes={323} replies={323}  postTitle="asdasdasd" />
  </>
}
export default UserPage