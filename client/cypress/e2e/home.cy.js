describe('Libero Italia E2E Tests', () => {
  it('Successfully loads the homepage and can scroll', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    // Basic interaction
    cy.scrollTo('bottom');
    cy.scrollTo('top');
  });

  it('Verifies main components exist', () => {
    cy.visit('/');
    cy.get('nav').should('exist');
    cy.get('main').should('exist');
    cy.get('footer').should('exist');
  });
});
