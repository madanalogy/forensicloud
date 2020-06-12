import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirestore } from 'reactfire'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import { LIST_PATH } from 'constants/paths'
import { useNotifications } from 'modules/notification'
import styles from './JobTile.styles'

const useStyles = makeStyles(styles)

function JobTile({ name, jobId, showDelete }) {
  const classes = useStyles()
  const history = useHistory()
  const { showError, showSuccess } = useNotifications()
  const firestore = useFirestore()

  function goToJob() {
    return history.push(`${LIST_PATH}/${jobId}`)
  }

  function deleteJob() {
    return firestore
      .doc(`jobs/${jobId}`)
      .delete()
      .then(() => showSuccess('Job deleted successfully'))
      .catch((err) => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not delete job')
        return Promise.reject(err)
      })
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.top}>
        <span className={classes.name} onClick={goToJob}>
          {name || 'No Name'}
        </span>
        {showDelete ? (
          <Tooltip title="delete">
            <IconButton onClick={deleteJob}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Paper>
  )
}

JobTile.propTypes = {
  jobId: PropTypes.string.isRequired,
  showDelete: PropTypes.bool,
  name: PropTypes.string
}

JobTile.defaultProps = {
  showDelete: true
}

export default JobTile
