/**
 * Database Schema - Drizzle ORM
 * 
 * Defines all tables for the AI Planner RAG system
 */

import { pgTable, varchar, decimal, text, serial, integer, jsonb, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

// ============================================================================
// planner_steps - Step definitions
// ============================================================================
export const plannerSteps = pgTable('planner_steps', {
    id: varchar('id', { length: 20 }).primaryKey(),
    stepNumber: decimal('step_number', { precision: 3, scale: 1 }).notNull(),
    question: text('question').notNull(),
    insight: text('insight').notNull(),
    category: varchar('category', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// planner_options - Answer options for each step
// ============================================================================
export const plannerOptions = pgTable('planner_options', {
    id: varchar('id', { length: 50 }).primaryKey(),
    stepId: varchar('step_id', { length: 20 }).notNull().references(() => plannerSteps.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    description: text('description'),
    nextStepId: varchar('next_step_id', { length: 20 }),
    metadata: jsonb('metadata'),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// planner_rules - RAG decision rules (JSONB-based matching)
// ============================================================================
export const plannerRules = pgTable('planner_rules', {
    id: serial('id').primaryKey(),
    ruleName: varchar('rule_name', { length: 100 }).notNull(),
    priority: integer('priority').default(0).notNull(),
    conditions: jsonb('conditions').notNull(), // Match criteria
    result: jsonb('result').notNull(), // Channel allocations
    explanation: text('explanation').notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// planner_sessions - User session tracking
// ============================================================================
export const plannerSessions = pgTable('planner_sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    answers: jsonb('answers').notNull(),
    recommendation: jsonb('recommendation'),
    totalBudget: decimal('total_budget', { precision: 12, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Export types
export type PlannerStep = typeof plannerSteps.$inferSelect;
export type PlannerOption = typeof plannerOptions.$inferSelect;
export type PlannerRule = typeof plannerRules.$inferSelect;
export type PlannerSession = typeof plannerSessions.$inferSelect;

export type NewPlannerStep = typeof plannerSteps.$inferInsert;
export type NewPlannerOption = typeof plannerOptions.$inferInsert;
export type NewPlannerRule = typeof plannerRules.$inferInsert;
export type NewPlannerSession = typeof plannerSessions.$inferInsert;

// ============================================================================
// Relations (for relational queries)
// ============================================================================
import { relations } from 'drizzle-orm';

export const plannerStepsRelations = relations(plannerSteps, ({ many }) => ({
    options: many(plannerOptions),
}));

export const plannerOptionsRelations = relations(plannerOptions, ({ one }) => ({
    step: one(plannerSteps, {
        fields: [plannerOptions.stepId],
        references: [plannerSteps.id],
    }),
}));

