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
import DropboxChooser from 'react-dropbox-chooser'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import List from '@material-ui/core/List'

const useStyles = makeStyles(styles)

function NewJobDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    control,
    watch,
    setValue,
    formState: { isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })

  const type = watch('type')
  const source = watch('source')

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-job-dialog-title">New Job</DialogTitle>
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <label htmlFor={Select}>Job Type: </label>
          <Controller
            as={
              <Select>
                <MenuItem value="" disabled>
                  Please Select
                </MenuItem>
                <MenuItem value="transfer">Storage Transfer</MenuItem>
                <MenuItem value="takeout">Drive Takeout</MenuItem>
              </Select>
            }
            name="type"
            rules={{ required: 'Type is required' }}
            control={control}
            defaultValue=""
            displayEmpty
            error={!!errors.type}
          />
          <br />
          <br />
          {(type === 'transfer' || type === 'takeout') && (
            <label htmlFor={Select}>Source: </label>
          )}
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
              defaultValue="aws"
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
          {type === 'transfer' && (source === 'aws' || source === 'azure') && (
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
          {type === 'takeout' && source === 'dropbox' && (
            <Controller
              as={
                <DropboxChooser
                  appKey="7kka06lq8ldmf39"
                  success={(files) => {
                    setValue('files', files)
                    const list = document.getElementById('fileList')
                    while (list.firstChild) {
                      list.removeChild(list.firstChild)
                    }
                    files.forEach((file, i) => {
                      if (i <= 15) {
                        const li = document.createElement('li')
                        if (i === 15) {
                          li.textContent = '... Only first 15 files are shown'
                        } else {
                          li.textContent = file.name
                        }
                        list.appendChild(li)
                      }
                    })
                  }}
                  multiselect
                  linkType="direct">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}>
                    Choose from Dropbox
                  </Button>
                </DropboxChooser>
              }
              name="files"
              control={control}
            />
          )}
          <br />
          {type === 'takeout' && source === 'dropbox' && (
            <List label="Selected Files" id="fileList" />
          )}
          {type === 'transfer' && (source === 'aws' || source === 'azure') && (
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
          {(type === 'transfer' || type === 'takeout') && (
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
