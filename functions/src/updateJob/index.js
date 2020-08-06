import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { generateBucketName } from 'utils/helpers'

/**
 * Updates a cloud service job.
 * @param {functions.pubsub.Message} message - PubSub event from function trigger. See:
 * https://cloud.google.com/storage-transfer/docs/reference/rest/v1/NotificationConfig
 * @param {functions.EventContext} context - Function context. More info in docs:
 * https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 * https://cloud.google.com/functions/docs/writing/background#function_parameters
 * @returns {Promise<void>}
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
  await jobRef
    .set(
      {
        status: data.status,
        completedAt: admin.firestore.Timestamp.fromMillis(Date.now()),
        access: []
      },
      {
        merge: true
      }
    )
    .catch(console.error)
  return completeJob(jobId, jobRef).catch(console.error)
}

/**
 * This function generates a list of URLs of all items in a bucket
 * @param {string} jobId Name of the bucket to generate URLs for
 * @param {any} jobRef Firestore document reference
 * @returns {Promise<void>}
 */
async function completeJob(jobId, jobRef) {
  const bucketName = await generateBucketName(jobId)
  const { Storage } = require('@google-cloud/storage')
  const options = {
    action: 'read',
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  }
  return new Storage().bucket(bucketName).getFiles((err, files) => {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((file) => {
      file.getSignedUrl(options, (e, signedUrl) => {
        if (e) {
          console.error(e)
          return
        }
        jobRef.update({
          access: admin.firestore.FieldValue.arrayUnion({
            name: file.name,
            url: signedUrl
          })
        })
      })
    })
  })
}

/**
 * Function to update a completed job. Triggered by PubSub publication.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .pubsub.topic('jobs')
  .onPublish(updateJob)
