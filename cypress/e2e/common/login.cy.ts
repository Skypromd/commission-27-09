describe('Login flow', () => {
    it('should login successfully through the UI', () => {
        // Начинаем с главной страницы
        cy.visit('/');

        // Нажимаем кнопку "Войти" в навбаре
        cy.getByTestId('Navbar.LoginBtn').click();

        // Заполняем имя пользователя и пароль
        cy.getByTestId('LoginForm.username').type('testuser');
        cy.getByTestId('LoginForm.password').type('123');

        // Нажимаем кнопку "Войти" в форме
        cy.getByTestId('LoginForm.LoginBtn').click();

        // Проверяем, что мы видим имя пользователя в навбаре, что подтверждает успешный вход
        cy.getByTestId('Navbar.Username').should('contain', 'testuser');
        cy.percySnapshot('Main page authenticated');
    });
});
