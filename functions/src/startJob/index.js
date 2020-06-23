import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Starts a cloud service job.
 * @param {functions.Change} change - Database event from function being
 * @param {admin.firestore.DataSnapshot} change.before - Snapshot of data before change
 * @param {admin.firestore.DataSnapshot} change.after - Snapshot of data after change
 * @param {functions.EventContext} context - Function context. More info in docs:
 * https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 * https://cloud.google.com/functions/docs/writing/background#function_parameters
 * @returns {Promise} Resolves with user's profile
 */
async function startJob(change, context) {
  const { jobId } = context.params || {}
  console.log(jobId)
}

/**
 * Function to begin cloud service job. Triggered by firestore job creation.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .firestore.document('/jobs/{jobId}')
  .onCreate(startJob)
