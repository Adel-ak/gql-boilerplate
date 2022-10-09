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

  type StoreLocation {
    code: String!
    name: String!
  }

  type AppProperties {
    _id: ObjectID!
    maxWishPerClient: Int!
    roles: [String!]!
    stores: [StoreLocation!]!
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

  input PaginateOptions {
    page: Int
    limit: Int
    sort: JSON
  }

  input UpdateAppPropertiesInput {
    maxWishPerClient: Int!
  }

  input StoreLocationInput {
    code: String!
    name: String!
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
