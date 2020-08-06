export const projectId = 'forensicloud'

export const signatureOptions = {
  version: 'v2',
  action: 'read',
  expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
}
