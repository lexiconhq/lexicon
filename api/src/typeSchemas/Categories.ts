import { objectType } from 'nexus';

export let Categories = objectType({
  name: 'Categories',
  definition(t) {
    t.string('color');
    t.string('defaultListFilter');
    t.string('defaultTopPeriod');
    t.nullable.string('defaultView');
    t.string('description');
    t.string('descriptionExcerpt');
    t.nullable.string('descriptionText');
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
    t.nullable.boolean('sortAscending');
    t.nullable.boolean('sortOrder');
    t.string('subcategoryListStyle');
    t.string('textColor');
    t.int('topicCount');
    t.nullable.string('topicTemplate');
    t.string('topicUrl');
    t.int('topicsAllTime');
    t.int('topicsDay');
    t.int('topicsMonth');
    t.int('topicsWeek');
    t.int('topicsYear');
    t.nullable.int('uploadedBackground');
    t.nullable.int('uploadedLogo');
  },
});
