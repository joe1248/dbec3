describe('dashboard page is correct', function () {

    const baseUrl = 'http://api.local.dbec3.com';

    context('Logout/in before each test', function () {
        beforeEach(function () {
            cy.visit(baseUrl + '/logout');
            cy.visit(baseUrl);
            cy.get('input[name="_username"]')
                .type('autotest_fake').should('have.value', 'autotest_fake');
            cy.get('input[name="_password"]')
                .type('autotest143RR').should('have.value', 'autotest143RR');
            cy.get('#button_submit_login').click();
            cy.title().should('eq', 'DBEC Dashboard');
        });

        it('Navigation links are presents', function () {
            cy.get('#menu').find('a').should('have.length', 2);

            cy.get('#menu').find('a').within(function ($links) {
                expect($links).to.have.length(2);
                expect($links.eq(0))
                    .to.have.attr('href', '#/list-of-connections')
                    .to.have.html('List of connections')
                ;
                expect($links.eq(1))
                    .to.have.attr('href', '#/new-connection')
                    .to.have.html('Add new connection')
                ;
            });

            cy.get('.dbec_about_menu').find('a').should('have.length', 2);

            cy.get('.dbec_about_menu').find('a').within(function ($links) {
                expect($links).to.have.length(2);
                expect($links.eq(0))
                    .to.have.attr('href', '#')
                    .to.have.html('Account Settings')
                ;
                expect($links.eq(1))
                    .to.have.attr('href', '#')
                    .to.have.html('Log out')
                ;
            });
        });

        it('Navigation links works', function () {
            cy.get('#menu').find('a').within(function ($links) {
                expect($links.eq(0)).to.have.attr('href', '#/list-of-connections');
            });
            cy.get('a[href="#/list-of-connections"]').click();
            cy.title().should('eq', 'Your connections');

            cy.get('#menu').find('a').within(function ($links) {
                expect($links.eq(1)).to.have.attr('href', '#/new-connection');
            });
            cy.get('a[href="#/new-connection"]').click();
            cy.title().should('eq', 'New connection');
        });
    });
});