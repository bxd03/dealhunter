import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const profiles=sqliteTable('profiles',{id:text('id').primaryKey(),data:text('data').notNull()});
export const catalog=sqliteTable('catalog',{id:text('id').primaryKey(),data:text('data').notNull(),updated:text('updated').notNull()});
export const collection=sqliteTable('collection',{id:text('id').primaryKey(),data:text('data').notNull()});
export const officialPromotions=sqliteTable('official_promotions',{id:text('id').primaryKey(),data:text('data').notNull()});
