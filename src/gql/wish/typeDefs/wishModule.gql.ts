import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************

  type Wish {
    _id: ObjectID!
    createdBy: ObjectID!
    client: Client!
    watch: Watch!
    store: StoreLocation!
    remark: String!
    createdAt: DateTime!
    updatedAt: DateTime
    _v: Int!
  }

  # ***************** Input Types *****************

  input AddToWishListInput {
    client: ObjectID!
    watch: ObjectID!
    remark: String
  }

  # ***************** Result Types *****************

  union AddToWishListPayload = Wish | ReqError | FieldErrors

  # ***************** Root Types *****************

  # extend type Query {
  #   me: MePayload!
  #   updateProfile(input: UpdateProfileInput!): UserPayload!
  # }

  extend type Mutation {
    addToWishList(input: AddToWishListInput!): AddToWishListPayload!
  }
`;
