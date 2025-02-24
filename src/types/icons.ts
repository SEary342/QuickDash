import * as mdiIcons from "@mdi/js";

const toCamelCase = (kebab: string): string =>
  kebab
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join("");

export const iconOptions: Record<string, string> = {
  "Death Star": "mdi-death-star",
  Account: "mdi-account",
  Chip: "mdi-chip",
  Link: "mdi-link-variant",
  Security: "mdi-shield-lock-outline",
  Server: "mdi-server",
  Jira: "mdi-jira",
  Ideas: "mdi-lightbulb-group-outline",
  Food: "mdi-baguette",
  Drink: "mdi-coffee-outline",
  Earth: "mdi-earth",
  Python: "mdi-language-python",
  JavaScript: "mdi-language-javascript",
  TypeScript: "mdi-language-typescript",
  Document: "mdi-file-document-outline",
  Help: "mdi-help",
  Code: "mdi-code-braces-box",
  Learn: "mdi-school-outline",
  Application: "mdi-application-outline",
  Vue: "mdi-vuejs",
  GitHub: "mdi-github",
  Bitbucket: "mdi-bitbucket",
  StackOverflow: "mdi-stack-overflow",
};

// Generate iconTranslation dynamically
export const iconTranslation = Object.fromEntries(
  Object.values(iconOptions).map((key) => [
    key,
    mdiIcons[toCamelCase(key) as keyof typeof mdiIcons],
  ])
);

// Generate sorted array of options
export const iconOptionsArray = Object.entries(iconOptions)
  .map(([title, value]) => ({ title, value }))
  .sort((a, b) => a.title.localeCompare(b.title));
