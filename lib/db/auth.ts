// ============================================================
// evuy — Autorización
//
// Sin Supabase no hay RLS: la base NO te protege sola.
// Toda función de datos recibe `actor: Actor | null` y decide acá.
//
// REGLA DURA: ningún componente ni route handler hace queries
// directas. Todo pasa por /lib/db/*. Sin excepciones.
// ============================================================

import type { Actor, UserRole } from './types';

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = 'No autorizado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class UnauthenticatedError extends Error {
  readonly status = 401;
  constructor(message = 'Necesitás iniciar sesión') {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}

export class NotFoundError extends Error {
  readonly status = 404;
  constructor(message = 'No encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** Jerarquía: admin puede todo lo de abajo. */
const ROLE_RANK: Record<UserRole, number> = {
  buyer: 0,
  seller: 1,
  creator: 2,
  dealer: 2,
  admin: 100,
};

export function isAdmin(actor: Actor | null): boolean {
  return actor?.role === 'admin';
}

export function requireAuth(actor: Actor | null): Actor {
  if (!actor) throw new UnauthenticatedError();
  return actor;
}

export function requireRole(actor: Actor | null, role: UserRole): Actor {
  const a = requireAuth(actor);
  if (ROLE_RANK[a.role] < ROLE_RANK[role]) {
    throw new ForbiddenError(`Requiere rol: ${role}`);
  }
  return a;
}

export function requireAdmin(actor: Actor | null): Actor {
  const a = requireAuth(actor);
  if (a.role !== 'admin') throw new ForbiddenError('Solo administradores');
  return a;
}

/** Dueño del recurso o admin. El patrón más usado del sistema. */
export function requireOwnerOrAdmin(actor: Actor | null, ownerId: string): Actor {
  const a = requireAuth(actor);
  if (a.id !== ownerId && a.role !== 'admin') {
    throw new ForbiddenError();
  }
  return a;
}

/**
 * Fragmento SQL de visibilidad para `listings`.
 * - Anónimo: solo publicados
 * - Dueño: los suyos, en cualquier estado
 * - Admin: todos
 *
 * Devuelve la cláusula y los params a mergear.
 */
export function listingVisibility(
  actor: Actor | null,
  paramIndex: number
): { clause: string; params: unknown[] } {
  if (isAdmin(actor)) {
    return { clause: 'TRUE', params: [] };
  }
  if (actor) {
    return {
      clause: `(l.status = 'published' OR l.user_id = $${paramIndex})`,
      params: [actor.id],
    };
  }
  return { clause: `l.status = 'published'`, params: [] };
}

/** Ídem para `models`. Los borradores solo los ve admin. */
export function modelVisibility(actor: Actor | null): string {
  return isAdmin(actor) ? 'TRUE' : `m.status = 'published'`;
}

/**
 * Los leads son el producto vendible: acceso muy restringido.
 * Solo admin, o el creator al que se le atribuye (ve los suyos).
 */
export function canReadLeads(actor: Actor | null): boolean {
  return actor?.role === 'admin';
}
