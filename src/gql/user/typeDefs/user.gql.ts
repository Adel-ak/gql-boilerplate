import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type User {
    _id: ObjectID!
    name: String!
    email: EmailAddress!
    role: ERoles!
    permissions: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Input Types *****************

  input MutateUserInput {
    name: String!
    email: String!
    password: String!
    role: ERoles!
    permissions: [String!]!
  }

  # ***************** Result Types *****************

  type UserResult implements Result {
    success: Boolean!
    error: ErrorResult
    data: User
  }

  extend type Mutation {
    createUser(input: MutateUserInput!): UserResult
    updateUser(id: ObjectID!, input: MutateUserInput!): UserResult
  }
`;
