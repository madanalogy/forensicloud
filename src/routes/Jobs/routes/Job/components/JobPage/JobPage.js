import React from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import { SuspenseWithPerf } from 'reactfire'
import LoadingSpinner from 'components/LoadingSpinner'
import JobData from '../JobData'
import styles from './JobPage.styles'

const useStyles = makeStyles(styles)

function JobPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="load-job">
          <JobData />
        </SuspenseWithPerf>
      </Card>
    </div>
  )
}

export default JobPage
