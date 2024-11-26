export default () => ({
  baseUrl: process.env.BASE_URL,
  database: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
});
