import { objectType } from '@nexus/schema';

export let Categories = objectType({
  name: 'Categories',
  definition(t) {
    t.string('color');
    t.string('defaultListFilter');
    t.string('defaultTopPeriod');
    t.string('defaultView', { nullable: true });
    t.string('description');
    t.string('descriptionExcerpt');
    t.string('descriptionText', { nullable: true });
    t.boolean('hasChildren');
    t.int('id');
    t.int('minimunRequiredTags');
    t.string('name');
    t.boolean('navigateToFirstPostAfterRead');
    t.int('notificationLevel');
    t.int('numFeaturedTopics');
    t.int('permission');
    t.int('position');
    t.int('postCount');
    t.boolean('readRestricted');
    t.boolean('showSubcategoryList');
    t.string('slug');
    t.boolean('sortAscending', { nullable: true });
    t.boolean('sortOrder', { nullable: true });
    t.string('subcategoryListStyle');
    t.string('textColor');
    t.int('topicCount');
    t.string('topicTemplate', { nullable: true });
    t.string('topicUrl');
    t.int('topicsAllTime');
    t.int('topicsDay');
    t.int('topicsMonth');
    t.int('topicsWeek');
    t.int('topicsYear');
    t.int('uploadedBackground', { nullable: true });
    t.int('uploadedLogo', { nullable: true });
  },
});
