import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { to } from 'utils/async'

/**
 * Updates a cloud service job.
 * @param {functions.Event} message - PubSub event from function trigger. See:
 * https://cloud.google.com/storage-transfer/docs/reference/rest/v1/NotificationConfig
 * @param {functions.EventContext} context - Function context. More info in docs:
 * https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 * https://cloud.google.com/functions/docs/writing/background#function_parameters
 * @returns {Promise} Resolves with user's profile
 */
async function updateJob(message, context) {
  const data = message.data
    ? JSON.parse(Buffer.from(message.data, 'base64').toString())
    : {}
  if (data === {}) {
    console.log('Empty payload')
    return
  }
  const jobRef = admin
    .firestore()
    .collection('jobs')
    .where('jobName', '==', data.transferJobName)
    .limit(1)

  await to(
    jobRef.update({
      status: data.status,
      endTime: data.endTime
    })
  )

  if (data.status === 'FAILED') {
    console.error(JSON.stringify(data.errorBreakdowns))
  }
}

/**
 * Function to update a completed job. Triggered by PubSub publication.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .pubsub.topic('jobs')
  .onPublish(updateJob)
