import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const projectId = 'forensicloud'

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
  const jobId = data.transferJobName.split('/')[1]
  const jobRef = admin.firestore().collection('jobs').doc(jobId)
  const hash = require('crypto').createHash('md5').update(jobId).digest('hex')
  const bucketName = `${projectId}-${hash}`
  const bucketUrl = await generateSignedUrl(bucketName).catch(console.error)

  await jobRef
    .update({
      status: data.status,
      completedAt: data.endTime,
      accessUrl: bucketUrl || ''
    })
    .catch(console.error)

  if (data.status === 'FAILED') {
    console.error(JSON.stringify(data.errorBreakdowns))
  }
}

/**
 * Generates the signed url for the bucket.
 * @param {string} bucketName - The name of the bucket to give access to
 * @returns {Promise<string>} - The signed URL for access
 */
async function generateSignedUrl(bucketName) {
  const options = {
    version: 'v2',
    action: 'list',
    expires: Date.now() + 1000 * 604800 // 7 days
  }

  // Get a signed URL for reading the bucket
  const [url] = await storage.bucket(bucketName).getSignedUrl(options)

  return url
}

/**
 * Function to update a completed job. Triggered by PubSub publication.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .pubsub.topic('jobs')
  .onPublish(updateJob)
