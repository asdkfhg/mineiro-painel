export const SESSION_COOKIE = "mineiro_session";

// Cookie value is just the shared secret itself: only someone who already
// knows PAINEL_SENHA_HASH (i.e. logged in with the right password) ever
// receives it, and it's compared byte-for-byte on every request.
export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta a variável SESSION_SECRET.");
  }
  return secret;
}
