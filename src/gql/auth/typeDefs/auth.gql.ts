import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************
  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }

  # ***************** Input Types *****************

  input LoginInput {
    email: String!
    password: String!
  }

  input RefreshSessionInput {
    accessToken: String!
    refreshToken: String!
  }

  # ***************** Result Types *****************

  type AuthTokensResult implements Result {
    success: Boolean!
    error: ErrorResult
    data: AuthTokens
  }

  extend type Mutation {
    login(input: LoginInput!): AuthTokensResult
    refreshSession(input: RefreshSessionInput!): AuthTokensResult
    signOut: Boolean
  }
`;
