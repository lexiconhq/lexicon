import { objectType } from '@nexus/schema';

export const PostRaw = objectType({
  name: 'PostRaw',
  definition: (t) => {
    t.string('raw');
    t.list.string('listOfCooked');
    t.list.string('listOfMention');
  },
});
