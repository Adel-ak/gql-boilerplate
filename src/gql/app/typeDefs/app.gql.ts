import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type FieldError {
    field: String!
    message: String!
  }

  type FieldsError {
    message: String!
    fields: [FieldError!]!
  }

  type ReqError {
    message: String!
    stack: JSON
  }

  type Test {
    id: Int!
    text: String
    i18n: TestI18nLangs
  }

  # ***************** Enum Types *****************

  enum ERoles {
    Dev
    User
    Admin
  }

  # ***************** Union Types *****************

  union ErrorResult = ReqError | FieldsError

  # ***************** interface Types *****************

  interface Result {
    success: Boolean!
    error: ErrorResult
  }

  # ***************** Root Types *****************

  type Query {
    _empty(text: String): Test
  }

  type Subscription {
    _empty: Test
  }

  type Mutation {
    _empty: String
  }
`;
