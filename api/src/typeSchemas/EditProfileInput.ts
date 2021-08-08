import { inputObjectType } from '@nexus/schema';

export let EditProfileInput = inputObjectType({
  name: 'EditProfileInput',
  definition(t) {
    t.string('name');
    t.string('bioRaw');
    t.string('website');
    t.string('location');
    t.string('dateOfBirth');
  },
});
