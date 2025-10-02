export const getByTestId = (testId: string) => {
    return cy.get(`[data-testid="${testId}"]`);
};

export const login = (username = 'testuser', password = '123') => {
    return cy.request({
        method: 'POST',
        url: 'http://localhost:8000/login',
        body: {
            username,
            password,
        },
    }).then(({ body }) => {
        window.localStorage.setItem('user', JSON.stringify(body));
        return body;
    });
};
