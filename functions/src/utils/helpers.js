import * as admin from 'firebase-admin'
import { projectId } from './const'

/**
 * This function generates a list of URLs of all items in a bucket
 * @param {string} jobId Name of the bucket to generate URLs for
 * @param {any} jobRef Firestore document reference
 * @param {string} status Job completion status
 */
export async function completeJob(jobId, jobRef, status) {
  const bucketName = await generateBucketName(jobId)
  const { Storage } = require('@google-cloud/storage')
  await jobRef
    .set(
      {
        status: status,
        completedAt: admin.firestore.Timestamp.fromMillis(Date.now()),
        access: []
      },
      {
        merge: true
      }
    )
    .catch(console.error)
  const options = {
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
  await new Storage().bucket(bucketName).getFiles((err, files) => {
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
 * Generates a project bucket name. See:
 * https://cloud.google.com/storage/docs/naming-buckets
 * @param {string} jobId Job ID to be hashed
 * @returns {Promise<string>} Resolves into the full bucket name
 */
export async function generateBucketName(jobId) {
  const hash = require('crypto').createHash('md5').update(jobId).digest('hex')
  return `${projectId}-${hash}`
}
