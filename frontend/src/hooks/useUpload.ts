import { MutationHookOptions } from '@apollo/client';
import { useState } from 'react';

import {
  UploadMutation as UploadType,
  UploadMutationVariables,
  UploadDocument,
} from '../generated/server';
import { errorHandlerAlert, formatImageLink } from '../helpers';
import { Image } from '../types';
import { useMutation } from '../utils';

export function useStatelessUpload(
  options?: MutationHookOptions<UploadType, UploadMutationVariables>,
) {
  const [upload, { loading }] = useMutation<
    UploadType,
    UploadMutationVariables
  >(UploadDocument, {
    ...options,
  });
  return { upload, loading };
}

export function useStatefulUpload(
  imagesArray: Array<Image>,
  currentToken: number,
  options?: MutationHookOptions<UploadType, UploadMutationVariables>,
) {
  const [completedToken, setCompletedToken] = useState(1);
  const [tempArray, setTempArray] = useState<Array<Image>>(imagesArray);
  let newArray = imagesArray;

  let [upload] = useMutation<UploadType, UploadMutationVariables>(
    UploadDocument,
    {
      ...options,
      onCompleted: ({ upload: result }) => {
        const {
          originalFilename: name,
          width,
          height,
          shortUrl: url,
          token,
        } = result;
        if (token) {
          const imageUrl = formatImageLink(name, width, height, url);
          newArray[token - 1] = { link: imageUrl, done: true };
          setTempArray(newArray);
          setCompletedToken(token);
        }
      },
      onError: (error) => {
        newArray[currentToken - 2] = { link: '', done: true };
        setTempArray(newArray);
        errorHandlerAlert(error);
      },
    },
  );

  return { upload, tempArray, completedToken };
}
