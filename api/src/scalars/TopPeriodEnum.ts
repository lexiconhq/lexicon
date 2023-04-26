import { enumType } from 'nexus';

export let TopPeriodEnum = enumType({
  name: 'TopPeriodEnum',
  members: ['YEARLY', 'QUATERLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'ALL'],
});
