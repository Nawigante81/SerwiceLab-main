import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, withCors } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { trackShipment } from "../_shared/inpostService.ts";
import { getAuthUserId, supabaseAdmin } from "../_shared/supabaseClient.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  const clientId = req.headers.get("x-forwarded-for") || "unknown";
  const rate = checkRateLimit(`inpost-track:${clientId}`, 30, 60_000);
  if (!rate.allowed) {
    return withCors(
      new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  try {
    await getAuthUserId(req);
    const url = new URL(req.url);
    const trackingFromPath = url.pathname.split("/").pop();
    const tracking = url.searchParams.get("tracking") || trackingFromPath;

    if (!tracking) {
      return withCors(new Response(JSON.stringify({ error: "Missing tracking number" }), { status: 400 }));
    }

    const trackingData = await trackShipment(tracking);

    const { data: shipment } = await supabaseAdmin
      .from("shipments")
      .select("id")
      .eq("tracking_number", tracking)
      .maybeSingle();

    if (shipment?.id) {
      await supabaseAdmin.from("shipment_events").insert({
        shipment_id: shipment.id,
        status: trackingData.status ?? null,
        raw_payload: trackingData,
      });

      await supabaseAdmin
        .from("shipments")
        .update({ status: trackingData.status ?? null })
        .eq("id", shipment.id);
    }

    return withCors(
      new Response(JSON.stringify({ tracking: trackingData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (error) {
    console.error("InPost tracking error:", error);
    return withCors(
      new Response(JSON.stringify({ error: "Unable to fetch tracking" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

serve(handler);
