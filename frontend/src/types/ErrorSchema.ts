import { ApolloError } from '@apollo/client';
import { CodedError } from 'expo-modules-core';
import { z } from 'zod';

export const ApolloErrorSchema = z.instanceof(ApolloError);

export const ErrorHandlerAlertSchema = z.union([ApolloErrorSchema, z.string()]);

export const CodedErrorExpoModuleSchema = z.instanceof(CodedError);

export const AS_AUTHORIZATION_ERROR_CODE = [
  'ERR_INVALID_OPERATION',
  'ERR_INVALID_RESPONSE',
  'ERR_INVALID_SCOPE',
  'ERR_REQUEST_CANCELED',
  'ERR_REQUEST_FAILED',
  'ERR_REQUEST_NOT_HANDLED',
  'ERR_REQUEST_NOT_INTERACTIVE',
  'ERR_REQUEST_UNKNOWN',
] as const;
export const ASAuthorizationError = z.object({
  code: z.enum(AS_AUTHORIZATION_ERROR_CODE),
  message: z.string(),
});
