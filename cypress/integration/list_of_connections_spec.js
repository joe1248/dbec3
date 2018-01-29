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
            cy.get('a[href="#/list-of-connections"]').click();
            cy.title().should('eq', 'Your connections');
        });

        it('shows the list of connection: title + button to add new', function () {
            cy.get('legend').should('have.html', 'Your DB Servers.');
            cy.get('button:first').should('have.text', 'Add New DB Server');
        });

        it('shows empty list of connection when all deleted', function () {
            cy.get('button').then(($buttons) => {
                if ($buttons.length > 0) {
                    cy.get('.deleteConnectionClass')
                        .each(function ($el, index, $list) {
                            $el.click();
                            cy.wait(1000);
                        })
                    ;
                }
            });
            cy.get('legend+span').should('have.text', 'No database connection yet, please add one.');
        });

        it('refuse to create empty connection', function () {
            cy.get('button:first').should('have.text', 'Add New DB Server').click();

            cy.get('#button_to_save_one_connection').click();
            cy.wait(1000);

            cy.get('.Alert-Error').eq(0).should(
                'have.text',
                'Several required parameters are missing: connectionName, urlHost, userName, passWord, portNumber'
            );
        });

        it('add basic connection and show it', function () {
            cy.get('button:first').should('have.text', 'Add New DB Server').click();

            cy.get('#db_connection_name').type('field_1').should('have.value', 'field_1');
            cy.get('#db_url_host').type('field_2').should('have.value', 'field_2');
            cy.get('#db_username').type('field_3').should('have.value', 'field_3');
            cy.get('#db_password').type('field_4').should('have.value', 'field_4');
            cy.get('#db_port_number').type('567').should('have.value', '567');

            cy.get('#button_to_save_one_connection').click();
            cy.wait(1000);

            cy.get('.Alert-Success').eq(0).should(
                'have.text',
                'Connection created'
            );

            cy.get('a[href="#/list-of-connections"]').click();
            cy.title().should('eq', 'Your connections');
            cy.get('table')
                .should('contain', 'field_1')
                .and('contain', 'Edit')
                .and('contain', 'Delete')
            ;
        });
    });
});
