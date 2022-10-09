import { gql } from 'apollo-server-core';
import { GQL_Paginate } from '../../../shared/types/gql.type.js';

export default gql`
  # ***************** Types *****************

  type User {
    _id: ObjectID!
    name: String!
    userName: String!
    deactivated: Boolean!
    role: ERoles!
    store: StoreLocation!
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
    store: StoreLocationInput!
  }

  input UpdateUserInput {
    _id: ObjectID!
    name: String
    userName: String
    password: String
    role: ERoles
    store: StoreLocationInput
    deactivated: Boolean
  }

  input UpdateProfileInput {
    userName: String!
    password: String!
  }

  input ListUsersFilterInput {
    role: ERoles
    name: String
    userName: String
    deactivated:  Boolean
    storeCode: String
  }

  # ***************** Result Types *****************

  union UserPayload = User | ReqError | FieldErrors

  union MePayload = User | ReqError

  type ListUsersResult {
    ${GQL_Paginate}
    docs: [User]!
  }

  # ***************** Root Types *****************

  extend type Query {
    me: MePayload!
    listUsers(filter: ListUsersFilterInput!, options: PaginateOptions!): ListUsersResult!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): UserPayload!
    updateProfile(input: UpdateProfileInput!): UserPayload!
    updateUser(input: UpdateUserInput!): UserPayload!
  }
`;
