"use client";

import { useEffect } from "react";

function utmsDaURL() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

function registrarEvento(tipo) {
  const body = JSON.stringify({ tipo, ...utmsDaURL() });
  // sendBeacon garante que o clique é registrado mesmo com a navegação
  // pro WhatsApp acontecendo logo em seguida.
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/eventos", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/eventos", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  }
}

export function RastreadorDeVisita() {
  useEffect(() => {
    registrarEvento("view");
  }, []);
  return null;
}

export function LinkWhatsApp({ children, ...props }) {
  return (
    <a {...props} onClick={() => registrarEvento("click_whatsapp")}>
      {children}
    </a>
  );
}
