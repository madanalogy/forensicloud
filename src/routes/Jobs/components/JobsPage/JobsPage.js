import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { SuspenseWithPerf } from 'reactfire'
import JobRoute from 'routes/Jobs/routes/Job'
import LoadingSpinner from 'components/LoadingSpinner'
import { renderChildren } from 'utils/router'
import JobsList from '../JobsList'

function JobsPage(routes, parentProps) {
  const match = useRouteMatch()
  return (
    <Switch>
      {/* Child routes */}
      {renderChildren([JobRoute], parentProps)}
      {/* Main Route */}
      <Route
        exact
        path={match.path}
        render={() => (
          <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="load-jobs">
            <JobsList />
          </SuspenseWithPerf>
        )}
      />
    </Switch>
  )
}

export default JobsPage
