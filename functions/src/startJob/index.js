import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const { google } = require('googleapis')
const { Storage } = require('@google-cloud/storage')
const storagetransfer = google.storagetransfer('v1')
const storage = new Storage()
const projectId = 'forensicloud'

/**
 * Starts a cloud service job.
 * @param {functions.Change} change - Database event from function being
 * @param {admin.firestore.DataSnapshot} change.before - Snapshot of data before change
 * @param {admin.firestore.DataSnapshot} change.after - Snapshot of data after change
 * @param {functions.EventContext} context - Function context. More info in docs:
 * https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 * https://cloud.google.com/functions/docs/writing/background#function_parameters
 */
async function startJob(change, context) {
  const { jobId } = context.params || {}
  const jobRef = admin.firestore().collection('jobs').doc(jobId)
  const hash = require('crypto').createHash('md5').update(jobId).digest('hex')
  const bucketName = `${projectId}-${hash}`
  let transferSpec = {}
  await jobRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.error('No such document!')
      } else if (
        doc.get('type') === 'transfer' &&
        doc.get('source') === 'aws'
      ) {
        transferSpec = {
          awsS3DataSource: {
            bucketName: doc.get('sourceName'),
            awsAccessKey: {
              accessKeyId: doc.get('awsIdAzureCon'),
              secretAccessKey: doc.get('accessKey')
            }
          },
          gcsDataSink: {
            bucketName: bucketName
          },
          transferOptions: {
            overwriteObjectsAlreadyExistingInSink: true,
            deleteObjectsFromSourceAfterTransfer: false
          }
        }
      } else if (
        doc.get('type') === 'transfer' &&
        doc.get('source') === 'azure'
      ) {
        transferSpec = {
          azureBlobStorageDataSource: {
            storageAccount: doc.get('sourceName'),
            azureCredentials: {
              sasToken: doc.get('accessKey')
            },
            container: doc.get('awsIdAzureCon')
          },
          gcsDataSink: {
            bucketName: bucketName
          },
          transferOptions: {
            overwriteObjectsAlreadyExistingInSink: true,
            deleteObjectsFromSourceAfterTransfer: false
          }
        }
      } else if (
        doc.get('type') === 'transfer' &&
        doc.get('source') === 'gcloud'
      ) {
        transferSpec = {
          gcsDataSource: {
            bucketName: doc.get('sourceName')
          },
          gcsDataSink: {
            bucketName: bucketName
          },
          transferOptions: {
            overwriteObjectsAlreadyExistingInSink: true,
            deleteObjectsFromSourceAfterTransfer: false
          }
        }
      } else if (
        doc.get('type') === 'takeout' &&
        doc.get('source') === 'dropbox'
      ) {
        // TODO: Implement dropbox takeout
      } else if (
        doc.get('type') === 'takeout' &&
        doc.get('source') === 'gdrive'
      ) {
        // TODO: Implement google drive takeout
      } else if (
        doc.get('type') === 'takeout' &&
        doc.get('source') === 'odrive'
      ) {
        // TODO: Implement one drive takeout
      } else {
        console.error('No such source!')
      }
    })
    .catch((err) => {
      console.error('Error getting document', err)
    })
  if (transferSpec !== {}) {
    await createJob(jobId, transferSpec, bucketName).catch(console.error)
  }
}

/**
 * Creates the bucket.
 * @param {string} bucketName - name of the bucket
 * @returns {boolean} Status of bucket creation
 */
async function createBucket(bucketName) {
  // Creates a new bucket in the Asia region with the standard default storage
  // class. Leave the second argument blank for default settings.
  //
  // For default values see: https://cloud.google.com/storage/docs/locations and
  // https://cloud.google.com/storage/docs/storage-classes

  try {
    await storage.createBucket(bucketName, {
      location: 'ASIA',
      storageClass: 'STANDARD'
    })
    await addBucketIamMember(bucketName)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * Adds the necessary IAM roles for the new bucket.
 * @param {string} bucketName Name of bucket
 */
async function addBucketIamMember(bucketName) {
  // Get a reference to a Google Cloud Storage bucket
  const bucket = storage.bucket(bucketName)

  // Gets and updates the bucket's IAM policy
  const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 })

  // Adds the new roles to the bucket's IAM policy
  policy.bindings.push({
    role: 'roles/storage.legacyBucketWriter',
    members: [
      'serviceAccount:project-346890162255@storage-transfer-service.iam.gserviceaccount.com'
    ]
  })

  // Updates the bucket's IAM policy
  await bucket.iam.setPolicy(policy)
}

/**
 * Creates the transfer job.
 * @param {string} jobId - jobId data
 * @param {any} transferSpec - Transfer Job Spec. See:
 * https://cloud.google.com/storage-transfer/docs/reference/rest/v1/TransferSpec
 * @param {string} bucketName - Name of the bucket
 * @returns {string} Name of the transfer
 */
async function createJob(jobId, transferSpec, bucketName) {
  const authClient = await authorize()
  if (!(await createBucket(bucketName))) return ''
  const date = new Date()
  const request = {
    resource: {
      name: `transferJobs/${jobId}`,
      description: jobId,
      status: 'ENABLED',
      projectId: projectId,
      notificationConfig: {
        pubsubTopic: `projects/${projectId}/topics/jobs`,
        payloadFormat: 'JSON'
      },
      schedule: {
        scheduleStartDate: {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear()
        },
        scheduleEndDate: {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear()
        }
      },
      transferSpec: transferSpec
    },
    auth: authClient
  }

  try {
    await storagetransfer.transferJobs.create(request)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Authorises application for transfer job.
 * @returns {google.auth.GoogleAuth} authClient
 */
async function authorize() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  })
  return auth.getClient()
}

/**
 * Function to begin cloud service job. Triggered by firestore job creation.
 * @type {functions.CloudFunction}
 */
export default functions
  .region('asia-east2')
  .firestore.document('/jobs/{jobId}')
  .onCreate(startJob)
