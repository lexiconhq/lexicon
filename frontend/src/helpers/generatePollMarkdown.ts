export type PollOption = { option: string };
export type PollChoice = 'regular' | 'multiple' | 'number';

type Params = {
  type: PollChoice;
  title?: string;
  minChoice?: number;
  maxChoice?: number;
  step?: number;
  options: Array<PollOption | string>;
  results: string;
  chartType: string;
  groups?: Array<string>;
  closeDateTime?: string;
  isPublic?: boolean;
  index: number;
};

export function generatePollMarkdown(params: Params): string {
  let {
    type,
    options,
    results,
    isPublic,
    chartType,
    minChoice,
    maxChoice,
    title,
    step,
    groups,
    closeDateTime,
    index,
  } = params;
  let pollOptions = options
    .map(
      (option) => `\n- ${typeof option === 'string' ? option : option.option}`,
    )
    .join('');

  let pollTitle = title ? `\n# ${title}` : '';
  let multipleChoiceSetting =
    type === 'multiple' ? ` min=${minChoice} max=${maxChoice}` : '';
  let numberRatingSetting =
    type === 'number' ? ` min=${minChoice} max=${maxChoice} step=${step}` : '';

  let advancedSettings = '';
  if (isPublic) {
    advancedSettings += ` public=true`;
  }
  if (groups && groups.length) {
    advancedSettings += ` groups=${groups.join(',')}`;
  }
  if (closeDateTime) {
    advancedSettings += ` close=${closeDateTime}`;
  }

  /**
   * name in here is require if there are more than one poll in one topic
   * where in discourse it will use index poll2, poll3
   */

  let pollMarkdown =
    `[poll name=poll${index} type=${type} results=${results} chartType=${chartType}` +
    multipleChoiceSetting +
    numberRatingSetting +
    advancedSettings +
    `]` +
    pollTitle +
    pollOptions +
    `\n[/poll]\n`;

  return pollMarkdown;
}
