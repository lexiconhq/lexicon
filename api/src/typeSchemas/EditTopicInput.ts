import { inputObjectType } from 'nexus';

export let EditTopicInput = inputObjectType({
  name: 'EditTopicInput',
  definition(t) {
    t.nullable.int('categoryId');
    t.nullable.string('featureLink'); // TODO: still not sure about the type of this var
    t.nullable.list.string('tags');
    t.nullable.string('title');
  },
});
