import {
  InvalidAccessError,
  AuthorizationError,
  errorHandler,
  SessionExpiredError,
} from '..';
import {
  ChangeUsernameError,
  EditPostError,
  errorTypes,
} from '../../constants';

const baseMockError = {
  name: '',
  message: '',
  isAxiosError: true,
  config: {},
  response: {
    status: 500,
    statusText: '',
    headers: {},
    data: {},
    config: {
      headers: {
        Cookie: '',
      },
    },
  },
  toJSON: function () {
    throw new Error('custom json function');
  },
};

describe('errorHandler', () => {
  it('should throw an error for username already taken', () => {
    const mockAxiosErrorUserName = {
      ...baseMockError,
      name: 'AxiosError',
      message: 'Request failed with status code 500',
      response: {
        ...baseMockError.response,
        data: {
          errors: ['This username is already taken'],
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorUserName)).toThrowError(
      'This username is already taken',
    );
  });

  it('should throw an error for failed request', () => {
    const mockOtherError = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          failed: 'Error message for failed request',
        },
      },
    };

    expect(() => errorHandler(mockOtherError)).toThrowError(
      'Error message for failed request',
    );
  });

  it('should throw an error for edit post error', () => {
    const mockAxiosErrorEditPostError = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          errors: [EditPostError],
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorEditPostError)).toThrowError(
      `You've passed the time limit to edit this post.`,
    );
  });

  it('should throw an error for change username error', () => {
    const mockAxiosErrorChangeUsernameError = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          errors: [ChangeUsernameError],
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorChangeUsernameError)).toThrowError(
      'This username is already taken',
    );
  });

  it('should throw an error invalid access', () => {
    const mockAxiosErrorInvalidAccessError = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          errors: [],
          error_type: errorTypes.invalidAccess,
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorInvalidAccessError)).toThrowError(
      new InvalidAccessError(),
    );
  });

  it('should throw an error unauthenticated access', () => {
    const mockAxiosErrorUnauthenticatedAccessError = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          errors: [],
          error_type: errorTypes.unauthenticatedAccess,
        },
      },
    };

    expect(() =>
      errorHandler(mockAxiosErrorUnauthenticatedAccessError),
    ).toThrowError(new AuthorizationError());
  });

  it('should throw an error session expire', () => {
    const mockAxiosErrorSessionExpire = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        config: {
          headers: {
            Cookie:
              '_t=jUpkKRhp1mKWuBp0IxBqUT0uYem7mAeruq4iqIWxySvYtQw26czsuhT7YwB7stg4',
          },
        },
        data: {
          errors: [],
          error_type: errorTypes.unauthenticatedAccess,
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorSessionExpire)).toThrowError(
      new SessionExpiredError(),
    );
  });

  it('should throw an exceeds file size error', () => {
    const mockAxiosErrorFileSize = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        status: 413,
        config: {
          headers: {
            Cookie:
              '_t=jUpkKRhp1mKWuBp0IxBqUT0uYem7mAeruq4iqIWxySvYtQw26czsuhT7YwB7stg4',
          },
        },
        data: {
          error: 'File size exceeds max size',
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorFileSize)).toThrowError(
      'The file size of your image exceeds the maximum allowed file size.',
    );
  });

  it('should throw an forbidden access', () => {
    const mockAxiosErrorForbiddenAccess = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        status: 403,
        data: 'Forbidden Access Error',
      },
    };

    expect(() => errorHandler(mockAxiosErrorForbiddenAccess)).toThrowError(
      'Forbidden Access Error',
    );
  });

  it('should throw an error for private topic error', () => {
    const mockAxiosErrorPrivateTopic = {
      ...baseMockError,
      response: {
        ...baseMockError.response,
        data: {
          errors: ['The topic cannot be accessed as it is a private topic.'],
        },
      },
    };

    expect(() => errorHandler(mockAxiosErrorPrivateTopic)).toThrowError(
      'The topic cannot be accessed as it is a private topic.',
    );
  });

  it('should throw an error beside axios error', () => {
    const mockError: Error = {
      name: 'custom error',
      message: 'throw custom error',
    };

    expect(() => errorHandler(mockError)).toThrowError('throw custom error');
  });
});
