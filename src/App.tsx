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

const testItem2: LinkData = {
  text: "Github",
  url: "https://github.com",
  color: "red",
  outline: true,
  icon: "mdi-death-star",
};

function App() {
  return (
    <div className="m-5 w-[300px] h-[200px] border">
      <Link item={testItem} upArrow downArrow editMode/>
      <Link item={testItem2} />
    </div>
  );
}

export default App;
