import { enumType } from '@nexus/schema';

export let TopPeriodEnum = enumType({
  name: 'TopPeriodEnum',
  members: ['YEARLY', 'QUATERLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'ALL'],
});
