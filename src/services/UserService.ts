import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";
import { CreateUserInput } from "../schemas/user.schemas";
import { hash } from "bcryptjs";

export class UserService{
  async execute({name, email, password, role}: CreateUserInput){
    // verifica se o email já existe
    const userAlreadyExist = await prisma.user.findUnique({
      where: { email }
    });

    if(userAlreadyExist){
      throw new AppError("This email address is already being used by another user.", 409);
    }
    // criptografa a senha
    const hashedPassword = await hash(password, 8);

    // cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true
      }
    });
    return user
  }

  async listAll() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc', 
    }
  });

  return users;
}

  async findById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    }
  });

  if (!user) {
    throw new AppError("User not found");
  }

  return user;
}

async delete(id: string) {
  const userExists = await prisma.user.findUnique({
    where: { id }
  });

  if (!userExists) {
    throw new AppError("User not found");
  }

  await prisma.user.delete({
    where: { id }
  });

  return { message: "User deleted successfully" };
}

async update(id: string, { name, email, role }: Partial<CreateUserInput>) {
  const userExists = await prisma.user.findUnique({
    where: { id }
  });

  if (!userExists) {
    throw new AppError("User not found");
  }

  if (email && email !== userExists.email) {
    const emailInUse = await prisma.user.findUnique({ where: { email } });
    if (emailInUse) {
      throw new AppError("Email already in use");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return updatedUser;
}

}