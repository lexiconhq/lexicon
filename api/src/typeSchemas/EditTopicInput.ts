import { inputObjectType } from '@nexus/schema';

export let EditTopicInput = inputObjectType({
  name: 'EditTopicInput',
  definition(t) {
    t.int('categoryId');
    t.string('featureLink'); //still not sure about the type of this var
    t.string('tags', { list: true });
    t.string('title');
  },
});
