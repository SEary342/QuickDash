import "./App.css";
import Dash from "./components/Dash";
import AppBar from "./components/AppBar";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const linkPages = useSelector((state: RootState) => state.linkPages);

  return (
    <div>
      <AppBar linkPages={linkPages} />
      <Dash linkPages={linkPages} />
    </div>
  );
}

export default App;
