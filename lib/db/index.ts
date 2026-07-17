// ============================================================
// evuy — capa de datos
//
// REGLA DURA: ningún componente, server action ni route handler
// hace queries directas a Postgres. Todo entra por acá.
//
// Sin RLS de Supabase, esta capa ES la seguridad. Una query
// suelta en un componente = un agujero de autorización.
// ============================================================

export * from './types';
export * from './auth';
export { pool, query, queryOne, transaction, WhereBuilder } from './client';

export * as models from './models';
export * as listings from './listings';
export * as leads from './leads';
export * as subscribers from './subscribers';
