import { LinkData } from "./types/linkData";
import "./App.css";
import { LinkGroup } from "./types/linkGroup";
import Dash from "./components/Dash";
import { LinkPage } from "./types/linkPage";
import AppBar from "./components/AppBar";

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

const linkPage: LinkPage = {
  name: "Test",
  groupList: [linkGroup, linkGroup],
  color: "red",
  icon: "mdi-death-star",
};

const linkPage2: LinkPage = {
  name: "Test2",
  groupList: [linkGroup, linkGroup],
  color: "red",
  icon: "mdi-death-star",
};

function App() {
  //return <LinkPanel linkGroup={linkGroup} moveDown moveUp />;
  return (
    <div>
      <AppBar />
      <Dash linkPages={[linkPage, linkPage2]} />
    </div>
  );
}

export default App;
