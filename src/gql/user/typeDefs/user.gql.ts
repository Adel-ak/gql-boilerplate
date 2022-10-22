import { gql } from 'apollo-server-core';
import { GQL_Paginate } from '../../../shared/types/gql.type.js';

export default gql`
  # ***************** Types *****************

  type User {
    _id: ObjectID!
    name: String!
    userName: String!
    active: Boolean!
    role: ERoles!
    store: String
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  type ToggleUserActivationResult {
    data: Boolean!
  }

  # ***************** Input Types *****************

  input CreateUserInput {
    name: String!
    userName: String!
    password: String!
    role: ERoles!
    store: String
  }

  input UpdateUserInput {
    _id: ObjectID!
    name: String
    userName: String
    password: String
    role: ERoles
    store: String
  }

  input UpdateProfileInput {
    userName: String!
    password: String!
  }

  input ListUsersInput {
    search: String
    filter: ListUsersFilterInput
    options: ListUsersOptionsInput
  }

  input ListUsersFilterInput {
    role: ERoles
    active:  Boolean
    store: String
  }

  input ListUsersOptionsInput {
    page: Int
    limit: Int
    sort: ListUsersSort
  }

  input ListUsersSort {
    role: Sort
    name: Sort
    userName: Sort
    active:  Sort
    store: Sort
    createdAt: Sort
  }

  # ***************** Result Types *****************

  union UserPayload = User | ReqError | FieldErrors

  union MePayload = User | ReqError

  union ToggleUserActivationPayload = User | ReqError

  type ListUsersResult {
    ${GQL_Paginate}
    docs: [User!]!
  }

  # ***************** Root Types *****************

  extend type Query {
    me: MePayload!
    listUsers(input:ListUsersInput): ListUsersResult!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): UserPayload!
    updateProfile(input: UpdateProfileInput!): UserPayload!
    updateUser(input: UpdateUserInput!): UserPayload!
    toggleUserActivation(_id: ObjectID!, active: Boolean!): ToggleUserActivationPayload!
  }
`;
