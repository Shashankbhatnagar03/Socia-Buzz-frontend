

import {  Container } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './component/Header'

function App() {
  

  return (
    <>
    <Container centerContent >
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
