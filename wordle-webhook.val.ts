// Wordle webhook — paste this into a new HTTP val at val.town (free account).
// It gives you ONE URL that works as both webhook receiver and data source:
//   POST <your-val-url>  with JSON body + header  Authorization: Bearer <SECRET>
//   GET  <your-val-url>  returns the stored JSON (this is what the Wordle page fetches)
//
// After creating it:
// 1. Set SECRET below to something random.
// 2. Tell Claude the val URL — it goes into WD_API in Wordle.dc.html.
// 3. Point your daily iOS Shortcut / script POST at the same URL.
//
// Expected JSON body:
// { "puzzle": "1,840", "score": "5/6",
//   "rows": [["y","b","b","y","b"], ["g","b","b","y","b"], ...] }
// g = green, y = yellow, b = absent

import { blob } from "https://esm.town/v/std/blob";

const SECRET = "2354";
const KEY = "wordle_data";

export default async function (req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  if (req.method === "POST") {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${SECRET}`) {
      return new Response("unauthorized", { status: 401, headers: cors });
    }
    let data;
    try {
      data = await req.json();
    } catch {
      return new Response("invalid json", { status: 400, headers: cors });
    }
    if (!data || !Array.isArray(data.rows)) {
      return new Response("bad shape: expected { puzzle, score, rows[][] }", { status: 400, headers: cors });
    }
    await blob.setJSON(KEY, data);
    return new Response("ok", { headers: cors });
  }

  // GET — return the stored result
  const data = await blob.getJSON(KEY);
  return new Response(JSON.stringify(data ?? null), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
