import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
    jwtPayload: { email: string; role: string, id: string },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn: expiresIn as any,
    });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};
