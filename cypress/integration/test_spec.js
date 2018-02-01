describe('login page is correct', function () {

    const baseUrl = 'https://translate.google.com/?hl=es#nl/en/';

    const words = [
        'gaas',
        'haag',
        'haar',
        'haas',
        'kaas',
        'kaal',
        'laat',
        'naam', 
        'maan',
        'paal',
        'vaas',
        'zaag'
    ];

    it('plays a word', function () {
        for (let i = 0 ; i < words.length ; i++) {
            ///playWordTwice();
            cy.visit(baseUrl + words[i]);
            cy.get('#gt-src-listen').click();
            cy.wait(5000);
            cy.get('#gt-src-listen').click();
        }
    });

});

