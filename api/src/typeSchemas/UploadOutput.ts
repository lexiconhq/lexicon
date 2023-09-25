import { objectType } from 'nexus';

export let UploadOutput = objectType({
  name: 'UploadOutput',
  definition(t) {
    t.int('id');
    t.string('url');
    t.string('originalFilename');
    t.int('filesize');
    t.int('width');
    t.int('height');
    t.int('thumbnailWidth');
    t.int('thumbnailHeight');
    t.string('extension');
    t.string('shortUrl');
    t.nullable.string('shortPath');
    t.string('humanFilesize');
    t.nullable.int('retainHours');
    t.nullable.int('token');
  },
});
