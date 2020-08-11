import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { useParams } from 'react-router-dom'
import { useFirestoreDoc, useFirestore } from 'reactfire'
import { JOBS_COLLECTION } from 'constants/firebasePaths'
import { makeStyles } from '@material-ui/core/styles'
import styles from './JobData.styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'

const useStyles = makeStyles(styles)

function createData(label, data) {
  return { label, data }
}

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
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
      ? new Date(job.createdAt.seconds * 1000).toString()
      : 'error'
  const completedAt =
    job && job.completedAt
      ? new Date(job.completedAt.seconds * 1000).toString()
      : 'In Progress'

  const rows = [
    createData('Job Name', job && job.name),
    createData('Job Type', job && job.type && job.type.toUpperCase()),
    createData(
      'Source Details',
      'From: '
        .concat(job && job.source.toUpperCase())
        .concat(
          (job &&
            job.sourceName &&
            ', Name: '.concat(job.sourceName.toUpperCase())) ||
            ''
        )
    ),
    createData(
      'Status',
      job && job.status
        ? job.status === 'IN_PROGRESS'
          ? 'In Progress'
          : job.status === 'SUCCESS'
          ? 'Completed Successfully'
          : 'Completed with Errors'
        : null
    ),
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
              File List
            </TableCell>
            <TableCell align="left">
              <List>
                {job && job.access ? (
                  job.access.map((file, i) => (
                    <ListItemLink
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      <ListItemText primary={file.name} />
                    </ListItemLink>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Not Available" />
                  </ListItem>
                )}
              </List>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  )
}

export default JobData
