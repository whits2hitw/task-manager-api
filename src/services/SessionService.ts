import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export class SessionService {
  async execute({ email, password }: any) {

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Incorrect email or password.");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Incorrect email or password.");
    }

    const token = sign(
      { role: user.role },
      String(authConfig.jwt.secret), // Substitui a string fixa
      {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn as any,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}