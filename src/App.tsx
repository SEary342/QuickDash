import "./App.css";
import Dash from "./components/Dash";
import AppBar from "./components/AppBar/AppBar";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const linkPages = useSelector((state: RootState) => state.linkPages);

  return (
    <>
      <AppBar linkPages={linkPages} />
      <Dash linkPages={linkPages} />
    </>
  );
}

export default App;
