/**
 * Shared local product store for dev mode (no backend).
 * Uses in-memory store backed by localStorage for persistence across
 * page refreshes within the same app/port.
 *
 * IMPORTANT: Every public function that returns products creates a NEW array
 * so React Query structural sharing can detect changes properly.
 */

import type { Product } from './types';
import { PRODUCTS as BASE_MOCK_PRODUCTS } from './mockData';

const STORAGE_KEY = 'pb_local_products';

/** Safe check for browser environment (works without DOM lib). */
function isBrowser(): boolean {
  return typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined';
}

function getStorage(): any {
  if (!isBrowser()) return null;
  return (globalThis as any).localStorage;
}

// ─── Read / Write helpers ──────────────────────────

function readFromStorage(): Product[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY) as string | null;
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

function writeToStorage(products: Product[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// ─── Internal mutable store ────────────────────────

let _store: Product[] | null = null;

/** Initialize store from base mock data + localStorage overrides. */
function ensureStore(): Product[] {
  if (!_store) {
    const base = structuredClone(BASE_MOCK_PRODUCTS);
    const local = readFromStorage();
    const baseIds = new Set(base.map((p) => p.id));
    // Apply localStorage overrides to base products (e.g., admin approve/reject)
    for (const lp of local) {
      const idx = base.findIndex((bp) => bp.id === lp.id);
      if (idx !== -1) {
        base[idx] = lp;
      }
    }
    // Add locally-created products that aren't in base
    const extras = local.filter((p) => !baseIds.has(p.id));
    _store = [...base, ...extras];
  }
  return _store;
}

function persist(): void {
  if (!_store) return;
  writeToStorage(_store);
}

// ─── Public API ────────────────────────────────────
// Every function that returns products returns a NEW array/object
// so React Query can detect changes via structural sharing.

/** Get all products (base mock + locally created). Always returns a fresh array copy. */
export function getLocalProducts(): Product[] {
  return [...ensureStore()];
}

/** Add a product to the local store and persist. */
export function addLocalProduct(product: Product): void {
  ensureStore().push(product);
  persist();
}

/** Update a product in the local store by ID. Returns a fresh copy of the updated product or null. */
export function updateLocalProduct(productId: string, updates: Partial<Product>): Product | null {
  const store = ensureStore();
  const idx = store.findIndex((p) => p.id === productId);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...updates, updatedAt: new Date().toISOString() };
  persist();
  return { ...store[idx] };
}

/** Delete a product from the local store by ID. Returns true if found and deleted. */
export function deleteLocalProduct(productId: string): boolean {
  const store = ensureStore();
  const idx = store.findIndex((p) => p.id === productId);
  if (idx === -1) return false;
  store.splice(idx, 1);
  persist();
  return true;
}

/** Find a single product by ID. Returns a fresh copy. */
export function findLocalProduct(productId: string): Product | undefined {
  const found = ensureStore().find((p) => p.id === productId);
  return found ? { ...found } : undefined;
}

/** Force re-read from localStorage (e.g., after external changes). */
export function refreshLocalProducts(): void {
  _store = null;
}
