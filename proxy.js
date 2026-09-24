import { NextResponse } from "next/server";

const SESSION_COOKIE = "mineiro_session";

export function proxy(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;

  if (!secret || cookie !== secret) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/api/clientes/:path*", "/api/atendimentos/:path*", "/api/conteudo/:path*"],
};
