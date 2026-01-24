import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn, execSync } from 'node:child_process'

// --- Configuration ---
const PACKAGE_PATH = resolve(process.cwd(), 'package.json')
const LOCK_PATH = resolve(process.cwd(), 'package-lock.json')

const args = process.argv.slice(2)
const isFinishMode = args.includes('--finish')
const manualVersion = args.find(arg => !arg.startsWith('--'))

/**
 * Executes a shell command. 
 * Use 'inherit' for stdio so user can interact with prompts (like GPG).
 */
function runInteractiveCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- Running: ${command} ---`)
    const [cmd, ...args] = command.split(' ')
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true })

    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Command failed with code ${code}`))
    })
  })
}

/**
 * Executes a command and returns the string output (for branch/version checks).
 */
function getCommandOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch (error) {
    return ''
  }
}

/**
 * Logic to determine the version.
 */
function calculateVersion(currentVersion) {
  if (manualVersion) return manualVersion
  if (isFinishMode) return currentVersion

  const parts = currentVersion.split('.').map(Number)
  if (parts.length < 3 || parts.some(isNaN)) throw new Error(`Cannot parse version "${currentVersion}".`)
  parts[2]++
  return parts.join('.')
}

async function updateFiles(newVersion) {
  const packageData = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'))
  packageData.version = newVersion
  await writeFile(PACKAGE_PATH, JSON.stringify(packageData, null, 2) + '\n')

  try {
    const lockData = JSON.parse(await readFile(LOCK_PATH, 'utf8'))
    lockData.version = newVersion
    if (lockData.packages?.['']) lockData.packages[''].version = newVersion
    await writeFile(LOCK_PATH, JSON.stringify(lockData, null, 2) + '\n')
  } catch (e) {}
}

async function main() {
  try {
    const currentBranch = getCommandOutput('git rev-parse --abbrev-ref HEAD')
    const packageData = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'))
    const currentVersion = packageData.version || '0.0.0'
    const targetVersion = calculateVersion(currentVersion)

    if (!isFinishMode) {
      if (currentBranch !== 'main') {
        console.error(`\n🚫 Error: Must be on 'main' to start (Currently: ${currentBranch})`)
        process.exit(1)
      }

      console.log(`🚀 Starting release: **${targetVersion}**`)
      await updateFiles(targetVersion)
      
      const branchName = `release/v${targetVersion}`
      await runInteractiveCommand(`git checkout -b ${branchName}`)
      await runInteractiveCommand(`git add package.json package-lock.json`)
      await runInteractiveCommand(`git commit -m "chore: start release ${targetVersion}"`)
      
      console.log(`\n✅ Branch **${branchName}** created.`)

    } else {
      console.log(`🏗️ Finishing release: **${targetVersion}**`)
      
      if (!currentBranch.startsWith('release/v')) {
        console.warn(`⚠️ Warning: Not on a release branch (Currently: ${currentBranch})`)
      }

      await updateFiles(targetVersion)
      await runInteractiveCommand('npm run build')
      
      const tagName = `v${targetVersion}`
      await runInteractiveCommand(`git add .`)
      // Added --allow-empty to prevent stalls if nothing changed in build
      await runInteractiveCommand(`git commit -m "chore: final release build ${tagName}" --allow-empty`)
      
      // If this stalls, you will now see the GPG prompt in your terminal!
      await runInteractiveCommand(`git tag -a ${tagName} -m "Release ${tagName}"`)
      
      console.log(`\n✅ Tagged as **${tagName}**!`)
    }
  } catch (error) {
    console.error(`\n❌ Script failed:`, error.message)
    process.exit(1)
  }
}

main()