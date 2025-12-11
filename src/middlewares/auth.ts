import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envList } from '../config/envList';
import AppError from '../errors/AppError';
import { verifyToken } from '../modules/auth/auth.utils';
import User from '../modules/user/user.model';
import { catchAsync } from '../utils/catchAsync';

const authGuard = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let token = req.cookies?.accessToken;

        if (req.headers.authorization) {
            token = req.headers.authorization;
        }

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }


        let decoded;

        try {
            decoded = verifyToken(token, envList.JWT_ACCESS_SECRET);
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        const { role, email } = decoded;

        const user = await User.findOne({ email });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }

        const isUserStatusBlocked = user?.status === 'blocked';

        if (isUserStatusBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
        }



        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'Unauthorized to access this resource for this role.',
            );
        }

        (req as any).user = decoded as JwtPayload;
        next();
    });
};

export default authGuard;
