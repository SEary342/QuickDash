import * as mdiIcons from '@mdi/js'

const toCamelCase = (kebab: string): string =>
  kebab
    .split('-')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('')

const iconOptions: Record<string, string> = {
  'Death Star': 'mdi-death-star',
  Account: 'mdi-account',
  API: 'mdi-api',
  Ansible: 'mdi-ansible',
  AWS: 'mdi-aws',
  Azure: 'mdi-microsoft-azure',
  'Azure DevOps': 'mdi-microsoft-azure-devops',
  Bitbucket: 'mdi-bitbucket',
  Bug: 'mdi-bug',
  Calculator: 'mdi-calculator',
  'Car Mechanic': 'mdi-car-cog',
  Chip: 'mdi-chip',
  Cogs: 'mdi-cogs',
  Code: 'mdi-code-braces-box',
  Compass: 'mdi-compass',
  'C++': 'mdi-language-cpp',
  CPU: 'mdi-cpu-64-bit',
  'Cloud Infrastructure': 'mdi-cloud-cog',
  'Cloud Sync': 'mdi-cloud-sync',
  Cube: 'mdi-cube',
  Database: 'mdi-database',
  'Database Admin': 'mdi-database-cog',
  DigitalOcean: 'mdi-digital-ocean',
  Docker: 'mdi-docker',
  Document: 'mdi-file-document-outline',
  Drink: 'mdi-coffee-outline',
  Earth: 'mdi-earth',
  Engine: 'mdi-engine',
  Factory: 'mdi-factory',
  Flask: 'mdi-flask',
  'Git Branch': 'mdi-source-branch',
  Git: 'mdi-git',
  GitHub: 'mdi-github',
  GitLab: 'mdi-gitlab',
  Go: 'mdi-language-go',
  'Google Cloud': 'mdi-google-cloud',
  'Hammer & Wrench': 'mdi-hammer-wrench',
  'Hard Hat': 'mdi-hard-hat',
  Help: 'mdi-help',
  Ideas: 'mdi-lightbulb-group-outline',
  Java: 'mdi-language-java',
  JavaScript: 'mdi-language-javascript',
  Jira: 'mdi-jira',
  Kubernetes: 'mdi-kubernetes',
  Learn: 'mdi-school-outline',
  Linux: 'mdi-linux',
  Link: 'mdi-link-variant',
  Magnet: 'mdi-magnet',
  Kafka: 'mdi-apache-kafka',
  'Mechanical Robot': 'mdi-robot-industrial',
  Memory: 'mdi-memory',
  Microscope: 'mdi-microscope',
  Network: 'mdi-lan',
  Package: 'mdi-package-variant',
  Python: 'mdi-language-python',
  '3D Printer': 'mdi-printer-3d',
  React: 'mdi-react',
  Resistor: 'mdi-resistor',
  Ruler: 'mdi-ruler',
  Rust: 'mdi-language-rust',
  'Saw Blade': 'mdi-saw-blade',
  Screwdriver: 'mdi-screwdriver',
  Security: 'mdi-shield-lock-outline',
  Secrets: 'mdi-shield-key',
  Server: 'mdi-server',
  'Server Network': 'mdi-server-network',
  'Sine Wave': 'mdi-sine-wave',
  StackOverflow: 'mdi-stack-overflow',
  'Test Tube': 'mdi-test-tube',
  Terraform: 'mdi-terraform',
  Terminal: 'mdi-console',
  TypeScript: 'mdi-language-typescript',
  Tools: 'mdi-tools',
  Vue: 'mdi-vuejs',
  'Power Outlet': 'mdi-power-socket-us',
  Robot: 'mdi-robot',
  Application: 'mdi-application-outline',
  Food: 'mdi-baguette',
}

// Generate iconTranslation dynamically
export const iconTranslation = Object.fromEntries(
  Object.values(iconOptions).map((key) => [
    key,
    mdiIcons[toCamelCase(key) as keyof typeof mdiIcons],
  ]),
)

// Generate sorted array of options
export const iconOptionsArray = Object.entries(iconOptions)
  .map(([title, value]) => ({ title, value }))
  .sort((a, b) => a.title.localeCompare(b.title))
