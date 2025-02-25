//import QdLogo from "./assets/qdLogo.svg?component";
import { LinkData } from "./types/linkData";
import "./App.css";
import LinkPanel from "./components/LinkPanel";
import { LinkGroup } from "./types/linkGroup";

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

const linkGroup: LinkGroup = {
  name: "test",
  linkList: [testItem, testItem2],
  color: "red",
  icon: "mdi-chip",
};

function App() {
  return <LinkPanel linkGroup={linkGroup} moveDown moveUp />;
}

export default App;
