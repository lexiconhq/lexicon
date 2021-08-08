import { enumType } from '@nexus/schema';

export let UploadTypeEnum = enumType({
  name: 'UploadTypeEnum',
  members: ['avatar', 'composer'],
});
