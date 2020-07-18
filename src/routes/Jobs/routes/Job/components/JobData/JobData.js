import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { useParams } from 'react-router-dom'
import { useFirestoreDoc, useFirestore } from 'reactfire'
import { JOBS_COLLECTION } from 'constants/firebasePaths'
import { makeStyles } from '@material-ui/core/styles'
import styles from './JobData.styles'

const useStyles = makeStyles(styles)

function createData(label, data) {
  return { label, data }
}

function JobData() {
  const classes = useStyles()
  const { jobId } = useParams()
  const firestore = useFirestore()
  const jobRef = firestore.doc(`${JOBS_COLLECTION}/${jobId}`)

  const jobSnap = useFirestoreDoc(jobRef)
  const job = jobSnap.data()
  const createdAt =
    job && job.createdAt
      ? new Date(job.createdAt.seconds * 1000).toDateString()
      : 'error'
  const completedAt =
    job && job.completedAt
      ? new Date(job.completedAt.seconds * 1000).toDateString()
      : 'In Progress'

  const rows = [
    createData(
      'Source Details',
      'Type: '
        .concat(job && job.source.toUpperCase())
        .concat(', Name: ')
        .concat(job && job.sourceName.toUpperCase())
    ),
    createData('Status', job && job.status.toUpperCase()),
    createData(
      'Timestamps (UTC)',
      'Created At: '
        .concat(createdAt)
        .concat(', Completed On: ')
        .concat(completedAt)
    )
  ]

  return (
    <CardContent>
      <Typography component="h2">{(job && job.name) || 'Job'}</Typography>
      <Typography component="h3">
        Job Type: {(job && job.type.toUpperCase()) || 'Unknown'}
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="left">{row.data}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              Access URL(s)
            </TableCell>
            <TableCell align="left">
              <pre>
                {job && job.accessUrls
                  ? JSON.stringify(job.accessUrls, null, 2)
                  : 'Not Available'}
              </pre>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  )
}

export default JobData
