import { relations } from "drizzle-orm/relations";
import { user, account, session, task, transaction, wallet } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	tasks: many(task),
	transactions: many(transaction),
	wallets: many(wallet),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const taskRelations = relations(task, ({one, many}) => ({
	user: one(user, {
		fields: [task.userId],
		references: [user.id]
	}),
	transactions: many(transaction),
}));

export const transactionRelations = relations(transaction, ({one}) => ({
	user: one(user, {
		fields: [transaction.userId],
		references: [user.id]
	}),
	task: one(task, {
		fields: [transaction.taskId],
		references: [task.id]
	}),
}));

export const walletRelations = relations(wallet, ({one}) => ({
	user: one(user, {
		fields: [wallet.userId],
		references: [user.id]
	}),
}));