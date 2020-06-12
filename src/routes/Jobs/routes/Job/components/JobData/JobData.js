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

  return (
    <CardContent>
      <Typography component="h2">{(job && job.name) || 'Job'}</Typography>
      <Typography>{jobId}</Typography>
      <div style={{ marginTop: '4rem' }}>
        <pre>{JSON.stringify(job, null, 2)}</pre>
      </div>
    </CardContent>
  )
}

export default JobData
