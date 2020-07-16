import React from 'react'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './NewJobDialog.styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(styles)

function NewJobDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    control,
    watch,
    formState: { isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })

  const type = watch('type')
  const source = watch('source')

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
            autoFocus
            margin="normal"
            fullWidth
          />
          <br />
          <br />
          <label htmlFor={Select}>Job Type: </label>
          <Controller
            as={
              <Select>
                <MenuItem value="transfer">Storage Transfer</MenuItem>
                <MenuItem value="takeout">Drive Takeout</MenuItem>
              </Select>
            }
            name="type"
            rules={{ required: 'Type is required' }}
            control={control}
            defaultValue="transfer"
          />
          <br />
          <br />
          <label htmlFor={Select}>Source: </label>
          {type === 'transfer' && (
            <Controller
              as={
                <Select>
                  <MenuItem value="gcloud">Google Cloud</MenuItem>
                  <MenuItem value="azure">Microsoft Azure</MenuItem>
                  <MenuItem value="aws">Amazon Web Services</MenuItem>
                </Select>
              }
              name="source"
              rules={{ required: 'Source is required' }}
              control={control}
              defaultValue="gcloud"
            />
          )}
          {type === 'takeout' && (
            <Controller
              as={
                <Select>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                  <MenuItem value="gdrive" disabled>
                    Google Drive
                  </MenuItem>
                  <MenuItem value="odrive" disabled>
                    One Drive
                  </MenuItem>
                </Select>
              }
              name="source"
              rules={{ required: 'Source is required' }}
              control={control}
              defaultValue="dropbox"
            />
          )}
          <br />
          {
            // TODO: Add Dropbox Button
          }
          {type === 'transfer' && (
            <TextField
              error={!!errors.sourceName}
              helperText={errors.sourceName && 'Source Name is required'}
              name="sourceName"
              label={
                (source === 'gcloud' && 'GCloud Bucket Name') ||
                (source === 'aws' && 'AWS Bucket Name') ||
                (source === 'azure' && 'Azure Storage Account')
              }
              inputRef={register({
                required: true
              })}
              margin="normal"
              fullWidth
            />
          )}
          <br />
          {(source === 'aws' || source === 'azure') && (
            <TextField
              error={!!errors.awsIdAzureCon}
              helperText={errors.awsIdAzureCon && 'ID/Container is required'}
              name="awsIdAzureCon"
              label={
                (source === 'aws' && 'AWS Access Key ID') ||
                (source === 'azure' && 'Azure Container')
              }
              inputRef={register({
                required: true
              })}
              margin="normal"
              fullWidth
            />
          )}
          <br />
          {(source === 'aws' || source === 'azure') && (
            <TextField
              error={!!errors.awsIdAzureCon}
              helperText={errors.awsIdAzureCon && 'Access Key is required'}
              name="accessKey"
              label={
                (source === 'aws' && 'AWS Secret Access Key') ||
                (source === 'azure' && 'Azure SAS Key')
              }
              inputRef={register({
                required: true
              })}
              margin="normal"
              fullWidth
            />
          )}
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
