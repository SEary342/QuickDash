import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exec as execCallback } from 'node:child_process'
import { promisify } from 'node:util'

// Promisify child_process.exec for async/await use
const exec = promisify(execCallback)

// --- Configuration ---
const PACKAGE_PATH = resolve(process.cwd(), 'package.json')
const LOCK_PATH = resolve(process.cwd(), 'package-lock.json')
// The desired new version, or undefined if not provided
const inputVersion = process.argv[2]

/**
 * Executes a shell command and logs the output.
 * @param {string} command - The command to execute.
 */
async function runCommand(command) {
  console.log(`\n\n--- Running: ${command} ---`)
  try {
    const { stdout, stderr } = await exec(command)
    console.log(`\n** STDOUT **\n${stdout}`)
    if (stderr) {
      console.error(`\n** STDERR **\n${stderr}`)
    }
  } catch (error) {
    console.error(`\nERROR executing command: ${command}`)
    console.error(error.message)
    throw error
  }
}

/**
 * Calculates the new version string.
 * If inputVersion is provided, it uses that.
 * Otherwise, it reads current version from package.json and increments the patch number.
 * @param {string} currentVersion - The current version from package.json.
 * @returns {string} The calculated new version.
 */
function calculateNewVersion(currentVersion) {
  if (inputVersion) {
    console.log(`Using provided version: ${inputVersion}`)
    return inputVersion
  }

  console.log('No version provided. Automatically incrementing patch version.')

  // Split the version string into parts (major.minor.patch)
  const parts = currentVersion.split('.').map(Number)

  if (parts.length < 3 || parts.some(isNaN)) {
    console.error(
      `\nERROR: Cannot parse current version "${currentVersion}". Please use major.minor.patch format.`,
    )
    process.exit(1)
  }

  // Increment the patch number (the third element)
  parts[2]++

  // Rejoin the parts into the new version string
  const newVersion = parts.join('.')
  console.log(`Calculated new version: ${currentVersion} -> ${newVersion}`)
  return newVersion
}

/**
 * Updates the version in package.json and package-lock.json.
 */
async function updateVersions() {
  let newVersion

  // 1. Read package.json and calculate the new version
  try {
    const packageData = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'))
    const currentVersion = packageData.version || '0.0.0'

    newVersion = calculateNewVersion(currentVersion)

    // 2. Write the new version to package.json
    packageData.version = newVersion
    await writeFile(PACKAGE_PATH, JSON.stringify(packageData, null, 2) + '\n')

    console.log(`\nSuccessfully updated ${PACKAGE_PATH} to version **${newVersion}**.`)
  } catch (error) {
    console.error(`\nERROR during package.json read/write: ${error.message}`)
    process.exit(1)
  }

  // 3. Update package-lock.json (Propagate)
  try {
    const lockData = JSON.parse(await readFile(LOCK_PATH, 'utf8'))

    // Update the top-level version
    lockData.version = newVersion
    // Update the version inside the packages object for the root dependency
    if (lockData.packages && lockData.packages['']) {
      lockData.packages[''].version = newVersion
    }

    await writeFile(LOCK_PATH, JSON.stringify(lockData, null, 2) + '\n')

    console.log(`Successfully updated ${LOCK_PATH} to version **${newVersion}**.`)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`\nWARNING: ${LOCK_PATH} not found. Skipping lock file update.`)
    } else {
      console.error(`\nERROR updating package-lock.json: ${error.message}`)
      process.exit(1)
    }
  }

  return newVersion
}

/**
 * Restores the version in package.json and package-lock.json.
 * @param {string} version - The version to restore.
 */
async function restoreVersion(version) {
  console.log(`\nRolling back to version: ${version}`)
  try {
    // Restore package.json
    const packageData = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'))
    packageData.version = version
    await writeFile(PACKAGE_PATH, JSON.stringify(packageData, null, 2) + '\n')

    // Restore package-lock.json
    try {
      const lockData = JSON.parse(await readFile(LOCK_PATH, 'utf8'))
      lockData.version = version
      if (lockData.packages && lockData.packages['']) {
        lockData.packages[''].version = version
      }
      await writeFile(LOCK_PATH, JSON.stringify(lockData, null, 2) + '\n')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Warning: Could not restore package-lock.json: ${error.message}`)
      }
    }
    console.log('Rollback successful.')
  } catch (error) {
    console.error(`CRITICAL ERROR: Failed to rollback version: ${error.message}`)
  }
}

/**
 * Main execution function.
 */
async function main() {
  let originalVersion
  try {
    const packageData = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'))
    originalVersion = packageData.version || '0.0.0'

    // Step 1: Update the version numbers
    const finalVersion = await updateVersions()

    // Step 2: Run the build command
    await runCommand('npm run build')

    console.log(
      `\n\n✅ Script completed successfully: App released at version **${finalVersion}**!`,
    )
  } catch (error) {
    if (originalVersion) {
      console.error('\n❌ An error occurred. Attempting to rollback version...')
      await restoreVersion(originalVersion)
    } else {
      console.error('\n❌ An unhandled error occurred during the script execution.')
    }
    console.error(error)
    process.exit(1)
  }
}

main()
