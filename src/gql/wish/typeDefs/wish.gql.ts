import { gql } from 'apollo-server-core';
import { GQL_Paginate } from '../../../shared/types/gql.type.js';

export default gql`
  # ***************** Enums *****************
  
  enum EWishStatus {
    Cancelled 
    Pending
    Recommended
    Approved
    Completed
  }

  # ***************** Types *****************

  type WishStatusHistory {
    status: EWishStatus!
    user: User!
    at: DateTime!
  }

  type Wish {
    _id: ObjectID!
    user: User!
    clientId: ObjectID!
    clientName: String!
    clientCid: String!
    clientPhone: String!
    watchId: ObjectID!
    watchCode: String!
    watchName: String!
    store: String!
    status: EWishStatus!
    statusHistory: [WishStatusHistory!]!
    remark: String!
    expectedDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  type ListWishesResult {
    ${GQL_Paginate}
    docs: [Wish!]!
  }

  # ***************** Input Types *****************

  input CreateWishInput {
    clientCid: String!
    watchCode: String!
    store: String!
    expectedDate: DateTime
    remark: String
  }

  input ListWishesInput {
    search: String
    filter: ListWishesFilterInput
    options: ListWishesOptionsInput
  }

  input ListWishesFilterInput {
    watchIds: [ObjectID]
    clientIds: [ObjectID]
    store: [String]
    status: [EWishStatus]
    sortBy: String
    startDate: DateTime
    endDate: DateTime
  }

  input ListWishesOptionsInput {
    page: Int
    limit: Int
    sort: ListWishesSort
  }


  input ListWishesSort {
    clientName: Sort
    clientPhone: Sort
    clientCid: Sort
    createdAt: Sort
    store: Sort
    watchCode: Sort
    watchName: Sort
    status: Sort
  }

  input UpdateWishStatusInput {
    _id: ObjectID!
    status: EWishStatus!
  }

  input UpdateWishInput {
    _id: ObjectID!
    remark: String
  }

  # ***************** Result Types *****************

  union CreateWishPayload = Wish | ReqError | FieldErrors

  union UpdateWishPayload = Wish | ReqError | FieldErrors

  # ***************** Root Types *****************

  extend type Query {
    listWishes(input: ListWishesInput!): ListWishesResult!
  }

  extend type Mutation {
    createWish(input: CreateWishInput!): CreateWishPayload!
    updateWishStatus(input: UpdateWishStatusInput!): UpdateWishPayload!
    updateWish(input: UpdateWishInput!): UpdateWishPayload!
  }
`;
