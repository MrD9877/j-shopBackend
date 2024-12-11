const checkUserSchema = {
  username: {
    errorMessage: "Invalid username",
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should be at least 6 chars",
    },
  },
};
export default checkUserSchema;
