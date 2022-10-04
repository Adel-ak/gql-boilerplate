import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type User {
    _id: ObjectID!
    name: String!
    email: EmailAddress!
    deactivated: Boolean!
    role: ERoles!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Input Types *****************

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: ERoles!
  }

  input UpdateProfileInput {
    name: String!
    email: String!
    password: String!
  }

  # ***************** Result Types *****************

  type UserResult implements Result {
    success: Boolean!
    error: ErrorResult
    data: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): UserResult
    updateProfile(input: UpdateProfileInput!): UserResult
  }
`;
