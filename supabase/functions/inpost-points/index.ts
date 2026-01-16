import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, withCors } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { parseNumber, sanitizeQuery } from "../_shared/validation.ts";
import { searchPoints } from "../_shared/inpostService.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  const clientId = req.headers.get("x-forwarded-for") || "unknown";
  const rate = checkRateLimit(`inpost-points:${clientId}`, 30, 60_000);
  if (!rate.allowed) {
    return withCors(
      new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  try {
    const url = new URL(req.url);
    const query = sanitizeQuery(url.searchParams.get("query"));
    const lat = parseNumber(url.searchParams.get("lat"));
    const lng = parseNumber(url.searchParams.get("lng"));
    const type = sanitizeQuery(url.searchParams.get("type"), 20);

    const rawPoints = await searchPoints({ query, lat, lng, type });
    const pointsArray = Array.isArray(rawPoints)
      ? rawPoints
      : Array.isArray(rawPoints?.items)
      ? rawPoints.items
      : [];

    const points = pointsArray.map((point: any) => ({
      point_id: point.point_id ?? point.name ?? point.id ?? "",
      name: point.name ?? point.point_id ?? point.id ?? "",
      address:
        point.address?.line1 ||
        point.address?.street ||
        point.address?.address ||
        point.address ||
        "",
      lat: Number(point.location?.latitude ?? point.lat ?? point.latitude ?? 0),
      lng: Number(point.location?.longitude ?? point.lng ?? point.longitude ?? 0),
      type: point.type === "locker" || point.type === "parcel_locker" ? "locker" : "partner",
      hours: point.opening_hours ?? point.hours ?? null,
      description: point.description ?? null,
      image_url: point.image_url ?? null,
    }));
    return withCors(
      new Response(JSON.stringify({ points }), { status: 200, headers: { "Content-Type": "application/json" } })
    );
  } catch (error) {
    console.error("InPost points error:", error);
    return withCors(
      new Response(JSON.stringify({ error: "Unable to fetch pickup points" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

serve(handler);
