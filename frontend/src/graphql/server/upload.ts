import { gql } from '@apollo/client';

export const UPLOAD = gql`
  mutation Upload(
    $type: UploadTypeEnum!
    $userId: Int
    $file: File!
    $token: Int
  ) {
    upload(file: $file, type: $type, userId: $userId, token: $token) {
      id
      url
      filesize
      width
      height
      thumbnailWidth
      thumbnailHeight
      extension
      shortUrl
      shortPath
      humanFilesize
      originalFilename
      token
    }
  }
`;
