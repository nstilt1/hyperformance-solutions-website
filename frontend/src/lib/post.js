"use client";

import { Auth } from "aws-amplify";

export async function postToApi(url, payload) {
  const session = await Auth.currentSession();
  const accessToken = session.getAccessToken().getJwtToken();

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