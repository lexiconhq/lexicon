import { gql } from '@apollo/client';

export const UPLOAD = gql`
  mutation Upload($input: UploadInput!) {
    upload(input: $input)
      @rest(
        type: "UploadOutput"
        path: "/uploads.json"
        method: "POST"
        bodySerializer: "fileEncode"
      ) {
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
