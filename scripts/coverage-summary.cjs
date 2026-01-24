const fs = require('fs')

try {
  // Check if the summary file exists
  if (!fs.existsSync('coverage/coverage-summary.json')) {
    console.log('Coverage summary file not found. Skipping summary creation.')
    process.exit(0)
  }

  const coverageData = fs.readFileSync('coverage/coverage-summary.json', 'utf8')
  const t = JSON.parse(coverageData).total

  const summary = [
    '## 🧪 Test Coverage',
    '| Category | Coverage |',
    '| :--- | :--- |',
    `| **Lines** | \`${t.lines.pct}%\` |`,
    `| **Statements** | \`${t.statements.pct}%\` |`,
    `| **Functions** | \`${t.functions.pct}%\` |`,
    `| **Branches** | \`${t.branches.pct}%\` |`,
  ].join('\n')

  // Append to GitHub Actions step summary
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n')
  console.log('Successfully added coverage summary.')
} catch (error) {
  console.error('Error generating coverage summary:', error)
  process.exit(1)
}