import { Amplify } from "aws-amplify";

// Cognito settings come from the CDK stack (infra-cdk) through Amplify branch
// env vars, written to .env.production at build time. For local dev put them
// in .env.local (see README / `cdk deploy` outputs).
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      loginWith: { email: true },
    },
  },
});
