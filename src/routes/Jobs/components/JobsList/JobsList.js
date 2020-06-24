import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useFirestore, useUser, useFirestoreCollectionData } from 'reactfire'
import { useNotifications } from 'modules/notification'
import { JOBS_COLLECTION } from 'constants/firebasePaths'
import JobTile from '../JobTile'
import NewJobTile from '../NewJobTile'
import NewJobDialog from '../NewJobDialog'
import styles from './JobsList.styles'

const useStyles = makeStyles(styles)

function useJobsList() {
  const { showSuccess, showError } = useNotifications()
  // Get current user (loading handled by Suspense in JobsList)
  const auth = useUser()
  // Create a ref for jobs owned by the current user
  const firestore = useFirestore()
  const { FieldValue, FieldPath } = useFirestore

  const jobsRef = firestore
    .collection(JOBS_COLLECTION)
    .where('createdBy', '==', auth?.uid)
    .orderBy(FieldPath.documentId())

  // Query for jobs (loading handled by Suspense in JobsList)
  const jobs = useFirestoreCollectionData(jobsRef, { idField: 'id' })

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)

  function addJob(newInstance) {
    return firestore
      .collection(JOBS_COLLECTION)
      .add({
        ...newInstance,
        createdBy: auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        endTime: FieldValue.serverTimestamp(),
        jobName: '',
        status: 'CREATED'
      })
      .then(() => {
        toggleDialog()
        showSuccess('Job added successfully')
      })
      .catch((err) => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not add job')
        return Promise.reject(err)
      })
  }

  return { jobs, addJob, newDialogOpen, toggleDialog }
}

function JobsList() {
  const classes = useStyles()
  const { jobs, addJob, newDialogOpen, toggleDialog } = useJobsList()

  return (
    <div className={classes.root}>
      <NewJobDialog
        onSubmit={addJob}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
      />
      <div className={classes.tiles}>
        <NewJobTile onClick={toggleDialog} />
        {jobs &&
          jobs.map((job, ind) => {
            return (
              <JobTile
                key={`Job-${job.id}-${ind}`}
                name={job && job.name}
                jobId={job.id}
              />
            )
          })}
      </div>
    </div>
  )
}

export default JobsList
