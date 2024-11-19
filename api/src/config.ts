export default () => ({
    database: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
  });