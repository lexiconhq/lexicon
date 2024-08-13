import { siteSetting } from '../data';
import { ContextValue } from '../server';

export const siteResolvers = {
  Query: {
    site: (_: unknown, _arg: unknown, ctx: ContextValue) => {
      if (!ctx.token) {
        throw new Error('Authorization Failed');
      }
      return siteSetting;
    },
    pluginStatus: (_: unknown, _arg: unknown) => {
      return {
        appleLoginEnabled: false,
        loginLinkEnabled: true,
      };
    },
  },
};
