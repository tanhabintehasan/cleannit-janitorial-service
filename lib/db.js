// Minimal Supabase PostgREST client over Node's https module.
// Deliberately avoids global fetch so Next.js build/runtime fetch caching
// never interferes — builds and revalidations always read the live database.
import https from "https";

function base() {
  return process.env.SUPABASE_URL;
}
function key() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function sbRequest(method, table, { query = "", body = null, prefer = "" } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${base()}/rest/v1/${table}${query}`);
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      apikey: key(),
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json",
    };
    if (prefer) headers.Prefer = prefer;
    if (data) headers["Content-Length"] = Buffer.byteLength(data);
    const req = https.request(url, { method, headers }, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => {
        if (res.statusCode >= 400) return reject(new Error(`Supabase ${res.statusCode}: ${buf.slice(0, 200)}`));
        try {
          resolve(buf ? JSON.parse(buf) : null);
        } catch {
          resolve(buf);
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

export const sbSelect = (table, query) => sbRequest("GET", table, { query });
export const sbUpsert = (table, body) => sbRequest("POST", table, { body, prefer: "resolution=merge-duplicates,return=representation" });
export const sbInsert = (table, body) => sbRequest("POST", table, { body, prefer: "return=representation" });
export const sbUpdate = (table, query, body) => sbRequest("PATCH", table, { query, body });
export const sbDelete = (table, query) => sbRequest("DELETE", table, { query });
