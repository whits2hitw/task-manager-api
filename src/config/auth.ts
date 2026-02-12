import 'dotenv/config';

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || '8db8132924cd060f6432b498f32e658e',
    expiresIn: '1d',
  },
};