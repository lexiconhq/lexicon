import { enumType } from 'nexus';

import {
  POLL_CHART_TYPE,
  POLL_RESULTS,
  POLL_STATUS,
  POLL_TYPE,
} from '../types';

export let PollResult = enumType({
  name: 'PollResult',
  members: POLL_RESULTS,
});

export let PollStatus = enumType({
  name: 'PollStatus',
  members: POLL_STATUS,
});

export let PollType = enumType({
  name: 'PollType',
  members: POLL_TYPE,
});

export let PollChartType = enumType({
  name: 'PollChartType',
  members: POLL_CHART_TYPE,
});
