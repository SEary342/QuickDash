import Link from "./components/Link";
//import QdLogo from "./assets/qdLogo.svg?component";
import { LinkData } from "./types/linkData";
import "./App.css";

const testItem: LinkData = {
  text: "Github",
  url: "https://github.com",
  color: "red",
  outline: false,
  icon: "mdi-death-star",
};

function App() {
  return (
    <div className="m-5 w-[200px] h-[200px] border">
      <Link item={testItem} />
    </div>
  );
}

export default App;
