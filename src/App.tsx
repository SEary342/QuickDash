import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'

import AppBar from '@comp/AppBar'
import Dash from '@comp/Dash'

function App() {
  const linkPages = useSelector((state: RootState) => state.linkPages)

  return (
    <>
      <AppBar linkPages={linkPages} />
      <Dash linkPages={linkPages} />
    </>
  )
}

export default App
