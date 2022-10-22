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

  type AppProperties {
    maxWishPerClient: Int!
    roles: [String!]!
    stores: [String!]!

    # Return will be [EWishStatus as key]: [EWishStatus]
    wishStatusLifeCycle: JSON!

    # Return will be [ERole as key]: [EWishStatus]
    wishStatusNotAllowedByRole: JSON!
  }

  # ***************** Enum Types *****************

  enum ERoles {
    Admin
    Manager
    User
  }

  enum Sort {
    asc
    desc
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
