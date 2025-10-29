import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  items: text('items').notNull(),
  totalPrice: real('total_price').notNull(),
  totalKhr: integer('total_khr').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at').notNull(),
  confirmedAt: integer('confirmed_at'),
});