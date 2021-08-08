import { objectType } from '@nexus/schema';

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
    t.string('shortPath', { nullable: true });
    t.string('humanFilesize');
    t.int('retainHours', { nullable: true });
    t.int('token', { nullable: true });
  },
});
