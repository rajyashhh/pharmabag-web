/**
 * Generates a URL-friendly slug from a product name and ID
 */
export function generateProductSlug(name: string, id: string): string {
  if (!name) return id;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  return `${slug}-${id}`;
}

/**
 * Extracts the product ID from a slug
 * Assumes the ID is the part after the last hyphen and follows UUID or similar ID format
 */
export function parseProductIdFromSlug(slug: string): string {
  if (!slug) return '';
  
  // If the slug is already an ID (e.g. direct ID access), return it
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slug)) return slug;

  // Otherwise, split by hyphen and take the parts that form the ID
  // Since we use ${slug}-${id}, and id might contain hyphens (UUID), 
  // we count back 5 parts if it's a UUID, or just take the last part if it's a simple ID.
  
  const parts = slug.split('-');
  
  // Check if the last 5 parts form a UUID-like structure
  if (parts.length >= 5) {
    const potentialId = parts.slice(-5).join('-');
    if (uuidRegex.test(potentialId)) {
      return potentialId;
    }
  }
  
  // Fallback: just return the last part
  return parts[parts.length - 1];
}
