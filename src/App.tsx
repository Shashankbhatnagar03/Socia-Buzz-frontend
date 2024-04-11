

import { Button, Container } from '@chakra-ui/react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'

function App() {
  

  return (
    <>
    <Container centerContent >
     <Routes>
      <Route path="/:username" element={<UserPage/>}/>
      <Route path="/:username/post/:pid" element={<PostPage/>}/>
     </Routes>
     
    </Container>
    </>
  )
}

export default App
