const envSpecificLoginData = {
    dev: {
        username: 'dev_user',
        password: 'dev_password',
        expectedMessage: 'Welcome, dev_user!', // Expected message for assertions
    },
    qa: {
        username: 'qa_user',
        password: 'qa_password',
        expectedMessage: 'Welcome, qa_user!',
    },
    prod: {
        username: 'prod_user',
        password: 'prod_password',
        expectedMessage: 'Welcome, prod_user!',
    },
};

export default envSpecificLoginData;