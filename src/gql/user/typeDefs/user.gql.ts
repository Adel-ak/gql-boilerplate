import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type User {
    _id: ObjectID!
    name: String!
    userName: String!
    deactivated: Boolean!
    role: ERoles!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Input Types *****************

  input CreateUserInput {
    name: String!
    userName: String!
    password: String!
    role: ERoles!
  }

  input UpdateProfileInput {
    userName: String!
    password: String!
  }

  # ***************** Result Types *****************

  union UserPayload = User | ReqError | FieldErrors

  union MePayload = User | ReqError

  # ***************** Root Types *****************

  extend type Query {
    me: MePayload!
    updateProfile(input: UpdateProfileInput!): UserPayload!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): UserPayload!
    updateProfile(input: UpdateProfileInput!): UserPayload!
  }
`;
