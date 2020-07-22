import { projectId } from './const'

/**
 * This function generates a list of URLs of all items in a bucket
 * @param {string} jobId Name of the bucket to generate URLs for
 * @returns {Promise<{filename, url}>} Hashmap of filename to access URL
 */
export async function generateAccessUrls(jobId) {
  const hash = require('crypto').createHash('md5').update(jobId).digest('hex')
  const bucketName = `${projectId}-${hash}`
  const { Storage } = require('@google-cloud/storage')
  const storage = new Storage()
  const [files] = await storage.bucket(bucketName).getFiles()
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 6 * 24 * 60 * 60 * 1000 // 6 days
  }
  const urlList = {}
  await files.forEach((file) => {
    const [url] = storage
      .bucket(bucketName)
      .file(file.name)
      .getSignedUrl(options)
    urlList[file.name] = url
  })
  return urlList
}
