import httpStatus from 'http-status-codes';
import { envList } from '../../config/envList';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { ILoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';

const loginUser = async (payload: ILoginUser) => {
    const user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    const isPasswordMatched = await user.comparePassword(payload.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role!,
        id: user._id.toString(),
    };

    const accessToken = createToken(
        jwtPayload,
        envList.JWT_ACCESS_SECRET,
        envList.JWT_ACCESS_EXPIRES_IN,
    );

    const refreshToken = createToken(
        jwtPayload,
        envList.JWT_REFRESH_SECRET,
        envList.JWT_REFRESH_EXPIRES_IN,
    );

    return {
        accessToken,
        refreshToken,
        user
    };
};

const refreshToken = async (token: string) => {
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;
    try {
        decoded = verifyToken(token, envList.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const { email } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role!,
        id: user._id.toString(),
    };

    const accessToken = createToken(
        jwtPayload,
        envList.JWT_ACCESS_SECRET,
        envList.JWT_ACCESS_EXPIRES_IN,
    );

    return {
        accessToken,
    };
};

export const AuthService = {
    loginUser,
    refreshToken,
};
