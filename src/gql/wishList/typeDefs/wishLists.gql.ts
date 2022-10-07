import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type WishList {
    _id: ObjectID!
    clientID: ObjectID!
    clientCid: String!
    clientName: String!
    clientPhone: String!
    itemID: ObjectID!
    itemName: String!
    itemCode: String!
    branch: StoreBranches!
    remark: String!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }
`;
