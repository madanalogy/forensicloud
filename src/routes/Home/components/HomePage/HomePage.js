import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import GitHubIcon from '@material-ui/icons/GitHub'
import { LIST_PATH, LOGIN_PATH, SIGNUP_PATH } from 'constants/paths'
import styles from './HomePage.styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const github = 'https://github.com/madanalogy/ForensiCloud'

const useStyles = makeStyles(styles)

function Home() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h3" gutterBottom>
        Cloud Services for Digital Forensics
      </Typography>
      <Paper>
        <Grid container justify="center">
          <Grid item sm className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Transfer
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Transfer data from cloud storage providers. Supported providers:
            </Typography>
            <List>
              <ListItem>Google Cloud</ListItem>
              <ListItem>Amazon Web Services</ListItem>
              <ListItem>Microsoft Azure</ListItem>
            </List>
          </Grid>
          <Grid item sm className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Takeout
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Download data from a cloud storage service. Supported services:
            </Typography>
            <List>
              <ListItem>Dropbox</ListItem>
              <ListItem>Google Drive</ListItem>
              <ListItem>One Drive</ListItem>
            </List>
          </Grid>
          <Grid item sm className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Coming soon: Automatic analysis of data with the latest in Google
              AI services. Supported insights:
            </Typography>
            <List>
              <ListItem>Entity Sentiment Analysis</ListItem>
              <ListItem>Image OCR & Explicit Content</ListItem>
              <ListItem>Video Intelligence</ListItem>
            </List>
          </Grid>
          <Grid item sm className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Get Started
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              You will need to sign up to begin using ForensiCloud. Currently
              supported account types: Email & Google
            </Typography>
            <List>
              <ListItem>
                <Link to={LOGIN_PATH}>Login</Link>
              </ListItem>
              <ListItem>
                <Link to={SIGNUP_PATH}>Sign Up</Link>
              </ListItem>
              <ListItem>
                <Link to={LIST_PATH}>Manage Jobs</Link>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      <br />
      <iframe
        title="ForensiCloud Demo"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/cZq8e_ekWLo"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <Typography variant="h3" component="h3" gutterBottom>
        <a href={github} target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
        </a>
      </Typography>
      {/* <Typography variant="subtitle1">
        <Link to={PRIVACY_PATH}>Privacy Policy</Link>
      </Typography> */}
    </div>
  )
}

export default Home
