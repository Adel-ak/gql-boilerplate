import { GQL_ERoles, GQL_EWishStatus } from '../generated-types/graphql.js';

const { Pending, Cancelled, Completed, Recommended, Approved } = GQL_EWishStatus;

export const StatusLifeCycle: Record<GQL_EWishStatus, GQL_EWishStatus[]> = {
  [Pending]: [Cancelled, Recommended, Approved],
  [Approved]: [Completed, Cancelled],
  [Completed]: [],
  [Cancelled]: [],
  [Recommended]: [Cancelled, Approved],
};

const { Admin, Manager, User } = GQL_ERoles;

export const StatusNotAllowedByRole: Record<GQL_ERoles, GQL_EWishStatus[]> = {
  [Admin]: [],
  [Manager]: [Approved],
  [User]: [Recommended, Approved],
};
