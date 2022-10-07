import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type FieldError {
    field: String!
    message: String!
  }

  type FieldErrors {
    fieldErrors: [FieldError!]!
  }

  type ReqError {
    message: String!
    stack: JSON
  }

  type StoreBranches {
    code: String!
    name: String!
  }

  type AppProperties {
    _id: ObjectID!
    maxWishPerClient: Int!
    roles: [String!]!
    branches: [StoreBranches!]!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Enum Types *****************

  enum ERoles {
    Admin
    Manager
    User
  }

  # ***************** Input Types *****************

  input UpdateAppPropertiesInput {
    maxWishPerClient: Int!
  }

  # ***************** Root Types *****************

  type Query {
    getAppProperties: AppProperties!
  }

  type Subscription {
    _empty: String
  }

  type Mutation {
    updateAppProperties(input: UpdateAppPropertiesInput!): AppProperties!
  }
`;
