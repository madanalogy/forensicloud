import { createSelector } from '../utils'

describe('Jobs Page', () => {
  beforeEach(() => {
    // Login using custom token
    cy.login()
    // Go to jobs page
    cy.visit('/jobs')
  })

  describe('Add Job', () => {
    it('creates job when provided a valid name', () => {
      const newJobTitle = 'Test job'
      cy.get(createSelector('new-job-tile')).click()
      // Type name of new job into input
      cy.get(createSelector('new-job-name')).find('input').type(newJobTitle)
      // Click on the new job button
      cy.get(createSelector('new-job-create-button')).click()
      // Wait for request to Firebase to add job to return
      cy.wait('@addJob')
      // Confirm first job tile has title passed to new job input
      cy.get(createSelector('job-tile-name'))
        .first()
        .should('have.text', newJobTitle)
    })
  })

  describe('Delete Job', () => {
    it('allows job to be deleted by job owner', () => {
      // click on the more button
      cy.get(createSelector('job-tile-more')).first().click()
      cy.get(createSelector('job-tile-delete')).click()
      // Confirm that new job is not available
      cy.get(createSelector('new-job-name')).should('not.exist')
    })
  })
})
