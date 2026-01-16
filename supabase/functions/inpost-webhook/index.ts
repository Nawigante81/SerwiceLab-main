import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

const verifySignature = async (rawBody: string, signature: string | null) => {
  const secret = Deno.env.get("INPOST_WEBHOOK_SECRET") ?? "";
  if (!secret) return true;
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signature;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-inpost-signature");
  const signatureOk = await verifySignature(rawBody, signature);

  if (!signatureOk) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const payload = JSON.parse(rawBody);
    const trackingNumber = payload?.tracking_number || payload?.tracking;
    const status = payload?.status ?? null;

    if (trackingNumber) {
      const { data: shipment } = await supabaseAdmin
        .from("shipments")
        .select("id")
        .eq("tracking_number", trackingNumber)
        .maybeSingle();

      if (shipment?.id) {
        await supabaseAdmin.from("shipment_events").insert({
          shipment_id: shipment.id,
          status,
          raw_payload: payload,
        });

        await supabaseAdmin
          .from("shipments")
          .update({ status })
          .eq("id", shipment.id);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("InPost webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
