import { projectId } from './const'

/**
 * This function generates a list of URLs of all items in a bucket
 * @param {string} jobId Name of the bucket to generate URLs for
 * @returns {Promise<[]>} URL list
 */
export async function generateAccessUrls(jobId) {
  const bucketName = await generateBucketName(jobId)
  const { Storage } = require('@google-cloud/storage')
  const options = {
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
  const urlList = []
  await new Storage().bucket(bucketName).getFiles(async function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    await files.forEach((file) => {
      file.getSignedUrl(options, async function (e, signedUrl) {
        if (e) {
          console.error(e)
          return
        }
        await urlList.push({
          name: file.name,
          url: signedUrl
        })
        console.log(signedUrl)
      })
    })
  })
  return urlList
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
