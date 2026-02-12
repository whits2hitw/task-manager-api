import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export class TeamService {
  async create(name: string, description?: string) {
    const teamAlreadyExists = await prisma.team.findFirst({
      where: {
        name: name
      }
    });

    if (teamAlreadyExists) {
      throw new AppError("Team already exists");
    }

    const team = await prisma.team.create({
      data: { name, description }
    });

    return team;
  }

  async listAll() {
    return await prisma.team.findMany();
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const team = await prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new Error("Team not found");
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
      }
    });

    return updatedTeam;
  }

  async delete(id: string) {
    const team = await prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new Error("Team not found");
    }

    await prisma.team.delete({ where: { id } });
  }

  async addMember(teamId: string, userId: string) {

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new AppError("Team not found", 404);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const alreadyMember = await prisma.teamMember.findFirst({
      where: {
        team_id: teamId,
        user_id: userId
      }
    });

    if (alreadyMember) {
      throw new AppError("User is already a member of this team");
    }

    return await prisma.teamMember.create({
      data: {
        team_id: teamId,
        user_id: userId
      }
    });
  }

  async removeMember(teamId: string, userId: string) {
    const member = await prisma.teamMember.findFirst({
      where: {
        team_id: teamId,
        user_id: userId
      }
    });

    if (!member) {
      throw new AppError("Member relationship not found", 404);
    }

    await prisma.teamMember.delete({
      where: {
        id: member.id
      }
    });
  }
  async listMembers(teamId: string) {

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new AppError("Team not found", 404);


    const members = await prisma.teamMember.findMany({
      where: { team_id: teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return members;
  }
}