import { z } from 'zod';

const loginValidationSchema = z.object({
    email: z.email('Email is required'),
    password: z.string('Password is required'),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string('Refresh token is required'),
    }),
});

export const AuthValidation = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
