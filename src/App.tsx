

import {  Container } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './component/Header'

function App() {
  const { pathname } = useLocation();
  return (
    <>
    <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}> 
      <Header/>
     <Routes>
      <Route path="/:username" element={<UserPage/>}/>
      <Route path="/:username/post/:pid" element={<PostPage/>}/>
     </Routes>
     
    </Container>
    </>
  )
}

export default App
