// Empreinte SHA-256 : le mot de passe n'est jamais stocké en clair.
// Attention : c'est une simulation pour la démo, pas une vraie sécurité (tout reste dans le navigateur).
export async function hash(email, pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`mg:${email.toLowerCase()}:${pw}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
