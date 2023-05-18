export const GET_SHARE_MESSAGE = `
  query GetShareMessage {
    share(where: {userId: "admin"}) {
      shareMessage
    }
  }
`;

export const GET_SHARE_COUNT = `
  query GetShareCount($userId: String!) {
    share(where: {userId: $userId}) {
      shareCount
      userId
    }
  }
`;

export const GET_SHARE_QUERY = `
query GetShare($userId: String!) {
  share(where: {userId: $userId}) {
    userId
    shareCount
  }
}
`;

export const UPDATE_AND_PUBLISH_SHARE_COUNT = `
  mutation UpdateAndPublishShareCount($userId: String!, $shareCount: Int!) {
    updateShare: updateShare(where: {userId: $userId}, data: {shareCount: $shareCount}) {
      id
      userId
      shareCount
    }
    publishShare: publishShare(where: {userId: $userId}, to: PUBLISHED) {
      id
      userId
      stage
    }
  }
`;

export const CREATE_AND_PUBLISH_NEW_SHARE = `
  mutation CreateAndPublishNewShare($userId: String!, $shareCount: Int!) {
    createShare: createShare(data: { userId: $userId, shareCount: $shareCount }) {
      id
      userId
      shareCount
      stage
    }
    publishShare: publishShare(where: {userId: $userId}, to: PUBLISHED) {
      id
      userId
      stage
    }
  }
`;
