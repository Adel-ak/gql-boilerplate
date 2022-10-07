import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************
  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }

  # ***************** Input Types *****************

  input LoginInput {
    userName: String!
    password: String!
  }

  input RefreshSessionInput {
    accessToken: String
    refreshToken: String
  }

  # ***************** Result Types *****************

  union AuthTokensPayload = AuthTokens | ReqError | FieldErrors

  extend type Mutation {
    login(input: LoginInput!): AuthTokensPayload!
    refreshSession: AuthTokensPayload!
    signOut: Boolean!
  }
`;
