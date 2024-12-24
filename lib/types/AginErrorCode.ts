export type AginError = {
    message: string;
    isFatal?: boolean;
    isSubsonicError?: boolean;
};

export type AginErrors = Record<string | number, AginError>;

export const errors: AginErrors = {
    ERR_SERVER_UNREACHABLE: {
        message: 'Server is unreachable',
        isFatal: true,
    },
    0: {
        message: 'Unknown Error',
    },
    10: {
        message: 'Required parameter is missing',
    },
    20: {
        message: 'Incompatible Subsonic REST protocol version. Client must upgrade.',
    },
    30: {
        message: 'Incompatible Subsonic REST protocol version. Server must upgrade.',
    },
    40: {
        message: 'Wrong username or password',
    },
    41: {
        message: 'Token authentication not supported for LDAP users',
    },
    42: {
        message: 'Provided authentication mechanism not supported',
    },
    43: {
        message: 'Multiple conflicting authentication mechanisms provided',
    },
    44: {
        message: 'Invalid API key',
    },
    50: {
        message: 'User is not authorized for the given operation',
    },
    60: {
        message: 'The trial period for the Subsonic server is over. Please upgrade to Subsonic Premium. Visit subsonic.org for details. (Also, why are you using not FOSS software???)',
    },
    70: {
        message: 'The requested data was not found',
    },
};

export type AginErrorCode = keyof typeof errors;
