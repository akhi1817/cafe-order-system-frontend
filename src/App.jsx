import React from 'react'
import Routing from './pages/Routing/Routing'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <>

    <Routing/>
          <Toaster position='top-center' richColors closeButton />

    
    </>
  )
}

export default App
