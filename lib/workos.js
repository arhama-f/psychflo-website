import { WorkOS } from "@workos-inc/node";

let _client = null;

export function getWorkOS() {
  if (!_client) {
    if (!process.env.WORKOS_API_KEY) throw new Error("WORKOS_API_KEY not set");
    _client = new WorkOS(process.env.WORKOS_API_KEY);
  }
  return _client;
}

export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;
