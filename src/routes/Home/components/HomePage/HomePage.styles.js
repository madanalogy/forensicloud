export default (theme) => ({
  root: {
    ...theme.flexColumnCenter,
    padding: theme.spacing(2)
  },
  section: {
    ...theme.flexColumnLeft,
    padding: theme.spacing(2),
    textAlign: 'left'
  }
})
