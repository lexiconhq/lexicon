import { ChatMessageContent } from '../types';

type Param = {
  data?: Array<Pick<ChatMessageContent, 'time'>>;
  currIndex: number;
  inverted?: boolean;
};

/**
 * The `compareTime` function determines whether to display a new timestamp in the chat
 * based on whether the current message was sent on a different day than the previous message.
 *
 * It compares the `time` property of the current and previous messages, checking if they
 * belong to the same calendar day. If the dates differ, it returns `true` to indicate
 * that a new timestamp should be displayed.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array<Pick<ChatMessageContent, 'time'>>} params.data - An array of message data containing `time` values.
 * @param {number} params.currIndex - The index of the current message being processed.
 * @param {boolean} params.inverted - The indicator of the compare direction of a list, with previous or next item.
 * @returns {Object} - Returns `isNewDay` and `isNewTimestamp`. `isNewDay` returns `true` if time difference is more than 1 day. `isNewTimestamp` returns `true` if time difference is more than 15 minutes.
 */
export function compareTime({ data, currIndex, inverted = false }: Param) {
  if (!data) {
    return { isNewDay: false, isNewTimestamp: false };
  }
  if (
    (currIndex === 0 && !inverted) ||
    (currIndex === data?.length - 1 && inverted)
  ) {
    return { isNewDay: true, isNewTimestamp: true };
  }
  const prevIndex = inverted ? currIndex + 1 : currIndex - 1;
  const time = data ? new Date(data[currIndex].time) : new Date();
  const prevTime = data ? new Date(data[prevIndex].time) : new Date();

  if (isNaN(time.getTime()) || isNaN(prevTime.getTime())) {
    return { isNewDay: false, isNewTimestamp: false };
  }

  const isNewDay =
    time.getFullYear() !== prevTime.getFullYear() ||
    time.getMonth() !== prevTime.getMonth() ||
    time.getDate() !== prevTime.getDate();

  const isNewTimestamp =
    Math.abs(time.getTime() - prevTime.getTime()) / (1000 * 60) > 15;

  return {
    isNewDay,
    isNewTimestamp,
  };
}
