import { groupMember, group, user, wallet, task } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { z } from "zod";

export const groupMemberSchema = z.object({
  userId: z.string(),
  groupId: z.string(),
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createGroup = async (
  name: string,
  description: string,
  creatorId: string
) => {
  if (!name || !description || !creatorId) {
    throw new Error("Name, description, and creator ID are required");
  }

  const [newGroup] = await db
    .insert(group)
    .values({
      name,
      description,
    })
    .returning();

  await db.insert(groupMember).values({
    userId: creatorId,
    groupId: newGroup.id,
  });

  return newGroup;
};

export const joinGroup = async (userId: string, groupId: string) => {
  if (!userId || !groupId) {
    throw new Error("User ID and Group ID are required");
  }

  const existingMember = await db
    .select()
    .from(groupMember)
    .where(
      and(eq(groupMember.userId, userId), eq(groupMember.groupId, groupId))
    )
    .limit(1);

  if (existingMember.length > 0) {
    throw new Error("User is already a member of this group");
  }

  const [newMember] = await db
    .insert(groupMember)
    .values({
      userId,
      groupId,
    })
    .returning();

  return newMember;
};

export const leaveGroup = async (userId: string, groupId: string) => {
  if (!userId || !groupId) {
    throw new Error("User ID and Group ID are required");
  }

  const [deletedMember] = await db
    .delete(groupMember)
    .where(
      and(eq(groupMember.userId, userId), eq(groupMember.groupId, groupId))
    )
    .returning();

  return deletedMember;
};

export const deleteGroup = async (groupId: string) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  const [deletedGroup] = await db
    .delete(group)
    .where(eq(group.id, groupId))
    .returning();

  return deletedGroup;
};

export const getAllGroups = async () => {
  return await db.select().from(group);
};

export const getUserGroups = async (userId: string) => {
  return await db
    .select({
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    })
    .from(groupMember)
    .innerJoin(group, eq(groupMember.groupId, group.id))
    .where(eq(groupMember.userId, userId));
};

export const getGroupMembers = async (groupId: string) => {
  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    })
    .from(groupMember)
    .innerJoin(user, eq(groupMember.userId, user.id))
    .where(eq(groupMember.groupId, groupId));
};

export const getGroupLeaderboard = async (groupId: string) => {
  return await db
    .select({
      userId: user.id,
      name: user.name,
      balance: wallet.balance,
    })
    .from(groupMember)
    .innerJoin(user, eq(groupMember.userId, user.id))
    .innerJoin(wallet, eq(user.id, wallet.userId))
    .where(eq(groupMember.groupId, groupId))
    .orderBy(desc(wallet.balance));
};

export const getGroupTasks = async (groupId: string) => {
  return await db
    .select({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      stake: task.stake,
      startTime: task.startTime,
      endTime: task.endTime,
      userName: user.name,
    })
    .from(groupMember)
    .innerJoin(task, eq(groupMember.userId, task.userId))
    .innerJoin(user, eq(task.userId, user.id))
    .where(eq(groupMember.groupId, groupId))
    .orderBy(desc(task.createdAt));
};
