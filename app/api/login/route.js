import { NextResponse } from "next/server";
import { SESSION_COOKIE, getSessionSecret } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { senha } = await request.json().catch(() => ({}));
  const senhaCorreta = process.env.PAINEL_SENHA;

  if (!senhaCorreta) {
    return NextResponse.json(
      { erro: "Painel não configurado (falta PAINEL_SENHA)." },
      { status: 500 }
    );
  }

  if (senha !== senhaCorreta) {
    return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, getSessionSecret(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 dias
  });
  return response;
}
