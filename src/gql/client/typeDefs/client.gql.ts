import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type Client {
    _id: ObjectID!
    cid: String!
    name: String!
    phone: String!
    blackListed: Boolean!
    premium: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }
`;
