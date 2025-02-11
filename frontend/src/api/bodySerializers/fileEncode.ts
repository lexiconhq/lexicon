import { RestLink } from 'apollo-link-rest';

export const fileEncodeBodySerializers: RestLink.Serializer = (
  data,
  headers,
) => {
  const { file, type, user_id } = data;
  if (type === 'avatar' && !user_id) {
    throw new Error('Upload avatar must include user id.');
  }

  const formData = new FormData();

  /**
   * In this part we add
   * {uri: file path, name: name of file, type: type of file (png, jpeg)}
   */
  formData.append('file', {
    ...file,
  });
  formData.append('type', type);

  if (user_id) {
    formData.append('user_id', user_id);
  }

  headers.set('Accept', '*/*');
  headers.set('Content-Type', 'multipart/form-data');
  return { body: formData, headers };
};
