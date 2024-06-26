import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./component/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./component/CreatePost";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import FollowerAndFollowingPage from "./pages/FollowerAndFollowingPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Box position={"relative"} w="full">
        <Container maxW={{ base: "620px", md: "740px" }}>
          <Header />
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path={`/:username/followings`}
              element={
                user ? <FollowerAndFollowingPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path={`/:username/followers`}
              element={
                user ? <FollowerAndFollowingPage /> : <Navigate to="/auth" />
              }
            />

            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <UserPage />
                    <CreatePost />
                  </>
                ) : (
                  <Navigate to={"/auth"} />
                )
              }
            />
            <Route
              path="/:username/post/:pid"
              element={user ? <PostPage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/settings"
              element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
            />

            <Route
              path="/search"
              element={user ? <SearchPage /> : <Navigate to={"/auth"} />}
            />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
