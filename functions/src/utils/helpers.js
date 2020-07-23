import { projectId } from './const'

/**
 * This function generates a list of URLs of all items in a bucket
 * @param {string} jobId Name of the bucket to generate URLs for
 * @returns {Promise<string>} Hashmap of filename to access URL
 */
export async function generateAccessUrls(jobId) {
  const bucketName = await generateBucketName(jobId)
  const { Storage } = require('@google-cloud/storage')
  const bucket = new Storage().bucket(bucketName)
  const options = {
    action: 'list',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
  const url = await bucket.getSignedUrl(options).url
  if (!url) {
    return 'Error'
  }
  return url
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
