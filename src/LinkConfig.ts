import {
  LinkPage,
  LinkGroup,
  LinkData,
  ColorOption
} from "./ConfigStructure";

export const numberOfColumns = 3;

export const selectedDashboard = "Programming";

export const QuickDashConfig: LinkPage[] = [
  new LinkPage("Programming", [
    new LinkGroup("Python", [
      new LinkData("Python.org", "https://www.python.org/", ColorOption.Dark),
      new LinkData(
        "RealPython",
        "https://realpython.com/",
        ColorOption.Yellow
      ),
      new LinkData(
        "W3 Schools (Python)",
        "https://www.w3schools.com/python/",
        ColorOption.Green
      )
    ]),
    new LinkGroup("JavaScript", [
      new LinkData(
        "W3 Schools (JavaScript)",
        "https://www.w3schools.com/js",
        ColorOption.Green
      ),
      new LinkData("Vue", "https://vuejs.org/", ColorOption.Green),
      new LinkData(
        "BootstrapVue",
        "https://bootstrap-vue.org/",
        ColorOption.Green
      ),
      new LinkData(
        "TypeScript",
        "https://www.typescriptlang.org/",
        ColorOption.Blue
      )
    ]),
    new LinkGroup("Other", [
      new LinkData("PluralSight", "https://app.pluralsight.com/"),
      new LinkData("GitHub", "https://github.com/"),
      new LinkData("StackOverflow", "https://stackoverflow.com/")
    ]),
    new LinkGroup("New Stuff")
  ]),
  new LinkPage("Programming 2", [
    new LinkGroup("Python", [
      new LinkData("Python.org", "https://www.python.org/", ColorOption.Dark),
      new LinkData(
        "RealPython",
        "https://realpython.com/",
        ColorOption.Yellow
      ),
      new LinkData(
        "W3 Schools (Python)",
        "https://www.w3schools.com/python/",
        ColorOption.Green
      )
    ]),
    new LinkGroup("JavaScript", [
      new LinkData(
        "W3 Schools (JavaScript)",
        "https://www.w3schools.com/js",
        ColorOption.Green
      ),
      new LinkData("Vue", "https://vuejs.org/", ColorOption.Green),
      new LinkData(
        "BootstrapVue",
        "https://bootstrap-vue.org/",
        ColorOption.Green
      ),
      new LinkData(
        "TypeScript",
        "https://www.typescriptlang.org/",
        ColorOption.Blue
      )
    ]),
    new LinkGroup("Other", [
      new LinkData("PluralSight", "https://app.pluralsight.com/"),
      new LinkData("GitHub", "https://github.com/"),
      new LinkData("StackOverflow", "https://stackoverflow.com/")
    ])
  ])
];
