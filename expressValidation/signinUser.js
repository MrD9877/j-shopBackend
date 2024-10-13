const checkUserSchema = {
    username: {
        errorMessage: 'Invalid username',
    },
    email: {
        errorMessage: 'Invalid username',
        isEmail: true,
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password should be at least 8 chars',
        },
    },
};
export default checkUserSchema;