describe('login page is correct', function () {

    const baseUrl = 'http://api.local.dbec3.com';

    context('Logout before each test', function () {
        beforeEach(function () {
            cy.visit(baseUrl + '/logout');
        });
    });

    it('title is login', function () {
        cy.visit(baseUrl);
        cy.title().should('eq', 'DBEC Login')
    });

    it('basic elements numbers are there', function () {
        cy.visit(baseUrl);

        // 5 inputs
        cy.get('body').find('input').should('have.length', 5);

        // 1 form
        cy.get('body').find('form')
            .should('have.length', 1)
            .should('have.attr', 'id', 'form_to_log_in')
        ;

        // check register button also there
        cy.get('#button_db_cloner_register_2')
            .should('have.attr', 'type', 'button')
            .should('have.attr', 'value', 'Register')
        ;
    });

    it('contains a form with 2 input text + 1 button + 1 hidden', function () {
        cy.visit(baseUrl);

        cy.get('#form_to_log_in').find('input').should('have.length', 4);

        cy.get('#form_to_log_in').within(function () {
            // check types
            cy.get('input:nth-child(1)').should('have.attr', 'type', 'text');
            cy.get('input:nth-child(2)').should('have.attr', 'type', 'password');
            cy.get('input:nth-child(3)').should('have.attr', 'type', 'button');
            cy.get('input:nth-child(4)').should('have.attr', 'type', 'hidden');

            // check names or id
            cy.get('input:nth-child(1)').should('have.attr', 'name', '_username');
            cy.get('input:nth-child(2)').should('have.attr', 'name', '_password');
            cy.get('input:nth-child(3)').should('have.attr', 'id', 'button_submit_login');
            cy.get('input:nth-child(4)').should('have.attr', 'name', '_target_path');

            // check values
            cy.get('input:nth-child(1)').should('have.attr', 'placeholder', 'User name or email');
            cy.get('input:nth-child(2)').should('have.attr', 'placeholder', 'Password');
            cy.get('input:nth-child(3)').should('have.attr', 'value', 'Sign in');
            cy.get('input:nth-child(4)').should('have.attr', 'value', '/dashboard');

        });
    });

    it('should not login if error password', function () {
        cy.visit(baseUrl);
        cy.get('input[name="_username"]')
            .type('fake@email.com').should('have.value', 'fake@email.com');
        cy.get('input[name="_password"]')
            .type('fake_password').should('have.value', 'fake_password');
        cy.get('#button_submit_login').click();

        cy.location().should(function (location) {
            expect(location.origin).to.eq(baseUrl);
            expect(location.pathname).to.eq('/login');
            expect(location.hash).to.be.empty;
            expect(location.href).to.eq(baseUrl + '/login');
        });
        
        cy.title().should('eq', 'DBEC Login');
    });

    it('should login if password is correct then logout by clicking logout', function () {
        cy.visit(baseUrl);
        cy.get('input[name="_username"]')
            .type('autotest_fake').should('have.value', 'autotest_fake');
        cy.get('input[name="_password"]')
            .type('autotest143RR').should('have.value', 'autotest143RR');
        cy.get('#button_submit_login').click();

        cy.location().should(function (location) {
            expect(location.origin).to.eq(baseUrl);
            expect(location.pathname).to.eq('/dashboard');
            expect(location.hash).to.eq('#/');
            expect(location.href).to.eq(baseUrl + '/dashboard#/');
        });

        cy.title().should('eq', 'DBEC Dashboard');

        // LOG OUT !
        cy.get('#button_new_logout').click();

        cy.location().should(function (location) {
            expect(location.origin).to.eq(baseUrl);
            expect(location.pathname).to.eq('/login');
            expect(location.hash).to.be.empty;
            expect(location.href).to.eq(baseUrl + '/login');
        });

        cy.title().should('eq', 'DBEC Login');

    });
});
