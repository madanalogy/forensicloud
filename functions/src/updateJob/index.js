import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Updates a cloud service job.
 * @param {functions.Event} event - PubSub event from function trigger
 * @param {functions.EventContext} context - Function context. More info in docs:
 * https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 * https://cloud.google.com/functions/docs/writing/background#function_parameters
 * @returns {Promise} Resolves with user's profile
 */
async function updateJob(event, context) {
  const payload = event.data ? Buffer.from(event.data, 'base64').toString() : ''
  if (payload === '') return
  const data = payload.split(';')
  const jobId = admin.firestore().collection('jobs').doc(data[0])
  console.log(jobId)
}

/**
 * Function to update a completed job. Triggered by PubSub publication.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .pubsub.topic('jobs')
  .onPublish(updateJob)
