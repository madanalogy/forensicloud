const glob = require('glob')
const path = require('path')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
require('source-map-support/register')

// Initialize Firebase so it is available within functions
admin.initializeApp(functions.firebaseConfig())

// Set Firestore timestamp settings
// NOTE: Skipped when running tests tests so it does not have to be mocked
if (process.env.NODE_ENV !== 'test') {
  admin.firestore().settings({ timestampsInSnapshots: true })
}

// Load all folders within dist directory (mirrors layout of src)
const files = glob.sync('./dist/**/index.js', {
  cwd: __dirname,
  ignore: ['./node_modules/**', './dist/utils/**', './dist/constants/**']
})

// Loop over all folders found within dist loading only the relevant function
// instead of all functions. Done to help improve function cold start times.
files.forEach((functionFile) => {
  // Get folder name from file name (removing any dashes)
  const folderName = path
    .basename(path.dirname(functionFile))
    .replace(/[-]/g, '')

  // Load single function from default
  !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === folderName // eslint-disable-line no-unused-expressions
    ? (exports[folderName] = require(functionFile).default) // eslint-disable-line global-require
    : () => {}
})
