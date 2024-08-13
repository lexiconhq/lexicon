export const mutationsResolvers = {
  Mutation: {
    timings: (
      _: unknown,
      __: { postNumbers: Array<number>; topicId: number },
    ) => {
      return 'success';
    },
  },
};
