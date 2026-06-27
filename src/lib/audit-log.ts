import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

type AuditClient = PrismaClient | Prisma.TransactionClient;

interface AuditInput {
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  changedBy?: string;
}

export async function recordChange(input: AuditInput, client: AuditClient = prisma) {
  return client.changeLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      description: input.description,
      changedBy: input.changedBy ?? 'system'
    }
  });
}
