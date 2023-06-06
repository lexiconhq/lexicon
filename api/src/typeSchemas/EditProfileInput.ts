import { inputObjectType } from 'nexus';

export let EditProfileInput = inputObjectType({
  name: 'EditProfileInput',
  definition(t) {
    t.nullable.string('name');
    t.nullable.string('bioRaw');
    t.nullable.string('website');
    t.nullable.string('location');
    t.nullable.string('dateOfBirth');
  },
});
