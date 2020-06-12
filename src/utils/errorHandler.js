import StackdriverErrorReporter from 'stackdriver-errors-js'
import { version } from '../../package.json'

let errorHandler // eslint-disable-line import/no-mutable-exports

/**
 * Initialize Stackdriver Error Reporter only if api key exists
 */
function initStackdriverErrorReporter() {
  try {
    const errorHandler = new StackdriverErrorReporter()
    errorHandler.start({
      key: process.env.REACT_APP_FIREBASE_apiKey,
      projectId: process.env.REACT_APP_FIREBASE_projectId,
      service: 'forensicloud-site',
      version
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      'Error setting up stackdriver client side error reporting',
      err
    )
  }
}

/**
 * Initialize client side error reporting. Error handling is only
 * initialized if in production environment.
 */
export function init() {
  if (!window.location.hostname.includes('localhost') && !window.Cypress) {
    initStackdriverErrorReporter()
  } else {
    errorHandler = console.error // eslint-disable-line no-console
  }
}

/**
 * Set user's uid within error reporting context (can be one or
 * many error handling utilities)
 * @param {Object} auth - Authentication data
 * @param {String} auth.uid - User's id
 */
export function setErrorUser(auth) {
  if (auth?.uid) {
    // Set user within Stackdriver
    if (errorHandler?.setUser) {
      errorHandler.setUser(auth.uid)
    }
  }
}

export default errorHandler
