import { enumType } from 'nexus';

export let BookmarkReminderEnum = enumType({
  name: 'BookmarkReminderEnum',
  members: [
    'later_today',
    'tomorrow',
    'later_this_week',
    'start_of_next_business_week',
    'next_week',
    'next_month',
    'custom',
  ],
});
