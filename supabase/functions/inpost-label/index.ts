import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, withCors } from "../_shared/cors.ts";
import { getShipmentLabel } from "../_shared/inpostService.ts";
import { getAuthUserId, supabaseAdmin } from "../_shared/supabaseClient.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  try {
    const userId = await getAuthUserId(req);
    const url = new URL(req.url);
    const idFromPath = url.pathname.split("/").pop();
    const shipmentId = url.searchParams.get("id") || idFromPath;
    if (!shipmentId) {
      return withCors(new Response(JSON.stringify({ error: "Missing shipment id" }), { status: 400 }));
    }

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .select("*")
      .eq("id", shipmentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !shipment) {
      return withCors(new Response(JSON.stringify({ error: "Shipment not found" }), { status: 404 }));
    }

    if (shipment.label_storage_path) {
      const { data: labelData, error: downloadError } = await supabaseAdmin.storage
        .from("shipment-labels")
        .download(shipment.label_storage_path);

      if (!downloadError && labelData) {
        return withCors(
          new Response(labelData, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="label-${shipmentId}.pdf"`,
            },
          })
        );
      }
    }

    if (!shipment.inpost_shipment_id) {
      return withCors(new Response(JSON.stringify({ error: "Missing InPost shipment id" }), { status: 400 }));
    }

    const labelResponse = await getShipmentLabel(shipment.inpost_shipment_id);
    const labelBuffer = await labelResponse.arrayBuffer();
    const labelPath = `${shipment.id}/label.pdf`;

    await supabaseAdmin.storage
      .from("shipment-labels")
      .upload(labelPath, labelBuffer, { contentType: "application/pdf", upsert: true });

    await supabaseAdmin
      .from("shipments")
      .update({ label_storage_path: labelPath })
      .eq("id", shipment.id);

    return withCors(
      new Response(labelBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="label-${shipmentId}.pdf"`,
        },
      })
    );
  } catch (error) {
    console.error("InPost label error:", error);
    return withCors(
      new Response(JSON.stringify({ error: "Unable to fetch label" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

serve(handler);
