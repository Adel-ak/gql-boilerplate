import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type Watch {
    _id: ObjectID!
    name: String!
    code: String!
    disabled: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Input Types *****************

  input FilterWatchesInput {
    search: String!
  }

  # ***************** Root Types *****************

  extend type Query {
    filterWatches(input: FilterWatchesInput!): [Watch!]!
  }
`;
