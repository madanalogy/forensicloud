import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { SuspenseWithPerf } from 'reactfire'
import LoadingSpinner from '../components/LoadingSpinner'
import { PrivateRoute } from 'utils/router'
import SetupAnalytics from '../components/SetupAnalytics'
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import LoginRoute from './Login'
import SignupRoute from './Signup'
import JobsRoute from './Jobs'
import AccountRoute from './Account'
import NotFoundRoute from './NotFound'
import PrivacyRoute from './Privacy'

export default function createRoutes() {
  return (
    <CoreLayout>
      <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="router-wait">
        <Switch>
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Route exact path={Home.path} component={() => <Home.component />} />
          {
            /* Build Route components from routeSettings */
            [
              AccountRoute,
              JobsRoute,
              SignupRoute,
              LoginRoute,
              PrivacyRoute
              /* Add More Routes Here */
            ].map((settings) =>
              settings.authRequired ? (
                <PrivateRoute key={`Route-${settings.path}`} {...settings} />
              ) : (
                <Route key={`Route-${settings.path}`} {...settings} />
              )
            )
          }
          <Route component={NotFoundRoute.component} />
          <SuspenseWithPerf traceId="analytics-setup" fallback="">
            <SetupAnalytics />
          </SuspenseWithPerf>
        </Switch>
      </SuspenseWithPerf>
    </CoreLayout>
  )
}
