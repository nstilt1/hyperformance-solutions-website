"use client";

import { fetchAuthSession } from "aws-amplify/auth";

export async function postToApi(url, payload) {
  const session = await fetchAuthSession();
  const accessToken = session?.tokens?.accessToken?.toString(); // JWT string

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

  // If your API returns JSON
  return await res.json().catch(() => null);
}