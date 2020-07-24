import { projectId } from './const'

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
