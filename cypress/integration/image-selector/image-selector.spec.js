describe('Image Selector Tests', () => {
    it('Ensure that the images loading works well', () => {
        cy.visit("http://localhost:8080/");
        cy.get('.ul-image').children().should('have.length', 100);
    })
})