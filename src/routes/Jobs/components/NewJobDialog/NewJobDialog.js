import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './NewJobDialog.styles'

const useStyles = makeStyles(styles)

function NewJobDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-job-dialog-title">New Job</DialogTitle>
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            error={!!errors.name}
            helperText={errors.name && 'Name is required'}
            name="name"
            label="Job Name"
            inputRef={register({
              required: true
            })}
            margin="normal"
            fullWidth
          />
          <br />
          <label htmlFor="type">Job Type: </label>
          <select name="type" ref={register} required>
            <option value="transfer">Transfer</option>
            <option value="takeout">Takeout</option>
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

NewJobDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewJobDialog
