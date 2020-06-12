import { loadable } from 'utils/router'

export default {
  path: ':jobId',
  authRequired: true,
  component: loadable(() =>
    import(/* webpackChunkName: 'Job' */ './components/JobPage')
  )
}
