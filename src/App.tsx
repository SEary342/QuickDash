import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'

import AppBar from '@comp/AppBar'
import Dash from '@comp/Dash'

function App() {
  const linkPages = useSelector((state: RootState) => state.linkPages)
  const darkMode = useSelector((state: RootState) => state.app.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <>
      <AppBar linkPages={linkPages} />
      <Dash linkPages={linkPages} />
    </>
  )
}

export default App
