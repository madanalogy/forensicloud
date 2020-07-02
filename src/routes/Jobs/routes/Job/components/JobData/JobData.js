import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { useParams } from 'react-router-dom'
import { useFirestoreDoc, useFirestore } from 'reactfire'
import { JOBS_COLLECTION } from 'constants/firebasePaths'

function JobData() {
  const { jobId } = useParams()
  const firestore = useFirestore()
  const jobRef = firestore.doc(`${JOBS_COLLECTION}/${jobId}`)

  const jobSnap = useFirestoreDoc(jobRef)
  const job = jobSnap.data()
  const createdAt =
    job && job.createdAt ? new Date(job.createdAt.seconds * 1000) : 'error'
  const completedAt =
    job && job.completedAt
      ? new Date(job.completedAt.seconds * 1000)
      : 'In Progress'

  return (
    <CardContent>
      <Typography component="h1">{(job && job.name) || 'Job'}</Typography>
      <Typography component="h2">
        {(job && job.type.toUpperCase()) || 'Type'}
      </Typography>
      <div style={{ marginTop: '4rem' }}>
        <table>
          <tr>
            <td>
              <b>Source Details</b>
            </td>
            <td>
              Type: {job && job.source.toUpperCase()} <br />
              Name: {job && job.sourceName.toUpperCase()}
            </td>
          </tr>
          <tr>
            <td>
              <b>Status</b>
            </td>
            <td>{job && job.status.toUpperCase()}</td>
          </tr>
          <tr>
            <td>
              <b>Timestamps (UTC)</b>
            </td>
            <td>
              Created: {createdAt} <br />
              Completed: {completedAt}
            </td>
          </tr>
          <tr>
            <td>
              <b>Access URL</b>
            </td>
            <td>
              <a
                href={(job && job.accessUrl) || '#'}
                target="_blank"
                rel="noopener noreferrer">
                {(job && job.accessUrl) || 'Not Available'}
              </a>
            </td>
          </tr>
        </table>
      </div>
    </CardContent>
  )
}

export default JobData
