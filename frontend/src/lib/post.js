"use client";

function decodeJwt(jwt) {
  const [, payload] = jwt.split(".");
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json);
}

import { fetchAuthSession } from "aws-amplify/auth";

export async function postToApi(url, payload) {
  const session = await fetchAuthSession();

  // User Pool access token (JWT) used for API Gateway JWT authorizers
  const accessToken = session.tokens?.accessToken?.toString();

  console.log("access claims", accessToken ? decodeJwt(accessToken) : null);

  if (!accessToken) {
    throw new Error("No access token available (user not signed in?)");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  // Helpful error text
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }

  return res;
}