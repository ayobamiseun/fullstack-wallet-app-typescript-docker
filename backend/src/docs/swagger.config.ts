const swaggerConfig = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Cash Transactions API',
      description: `This API allows users to manage bank accounts and perform transactions securely.

Features:
- JWT-based authentication.
- To access protected routes, log in and use the generated token in the request headers.
- Each user has a unique token and can only access their own account and transactions they are involved in.`,
      version: '1.0.0',
    },
    servers: [{
      url: 'http://localhost:3001',
      description: 'Local development server',
    }],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  },
  apis: [
    './src/routes/Account.ts',
    './src/routes/Transactions.ts',
    './src/routes/User.ts',
  ],
};

export default swaggerConfig;
