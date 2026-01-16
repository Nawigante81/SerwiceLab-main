import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, withCors } from "../_shared/cors.ts";
import { ensureOptionalString, ensureString } from "../_shared/validation.ts";
import { createShipment } from "../_shared/inpostService.ts";
import { getAuthUserId, supabaseAdmin } from "../_shared/supabaseClient.ts";

const buildInpostPayload = (params: {
  service_code: string;
  type: "locker" | "courier";
  receiver: { name: string; phone: string; email: string };
  pickup_point_id?: string | null;
  address?: {
    line1: string;
    line2?: string | null;
    postal_code: string;
    city: string;
    country?: string | null;
  };
}) => {
  const sender = {
    name: Deno.env.get("INPOST_SENDER_NAME") ?? "ServiceLab",
    phone: Deno.env.get("INPOST_SENDER_PHONE") ?? "",
    email: Deno.env.get("INPOST_SENDER_EMAIL") ?? "",
    address: {
      line1: Deno.env.get("INPOST_SENDER_ADDRESS_LINE1") ?? "",
      line2: Deno.env.get("INPOST_SENDER_ADDRESS_LINE2") ?? "",
      post_code: Deno.env.get("INPOST_SENDER_POSTAL_CODE") ?? "",
      city: Deno.env.get("INPOST_SENDER_CITY") ?? "",
      country_code: Deno.env.get("INPOST_SENDER_COUNTRY") ?? "PL",
    },
  };

  const parcels = [
    {
      weight: Number(Deno.env.get("INPOST_DEFAULT_WEIGHT") ?? 1),
      dimensions: {
        length: Number(Deno.env.get("INPOST_DEFAULT_LENGTH") ?? 10),
        width: Number(Deno.env.get("INPOST_DEFAULT_WIDTH") ?? 10),
        height: Number(Deno.env.get("INPOST_DEFAULT_HEIGHT") ?? 10),
      },
    },
  ];

  const payload: Record<string, unknown> = {
    service: params.service_code,
    receiver: {
      name: params.receiver.name,
      phone: params.receiver.phone,
      email: params.receiver.email,
    },
    sender,
    parcels,
  };

  if (params.type === "locker") {
    payload.custom_attributes = {
      target_point: params.pickup_point_id,
    };
  } else if (params.address) {
    payload.address = {
      line1: params.address.line1,
      line2: params.address.line2 ?? "",
      post_code: params.address.postal_code,
      city: params.address.city,
      country_code: params.address.country ?? "PL",
    };
  }

  return payload;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  try {
    const userId = await getAuthUserId(req);
    const body = await req.json();
    const orderId = ensureString(body.order_id, "order_id");
    const serviceCode = ensureString(body.service_code, "service_code");
    const type = ensureString(body.type, "type") as "locker" | "courier";

    const receiver = body.receiver ?? {};
    const receiverName = ensureString(receiver.name, "receiver.name");
    const receiverPhone = ensureString(receiver.phone, "receiver.phone");
    const receiverEmail = ensureString(receiver.email, "receiver.email");
    const pickupPointId = ensureOptionalString(body.pickup_point_id);
    const replace = Boolean(body.replace);

    const address =
      type === "courier"
        ? {
            line1: ensureString(body.address?.line1, "address.line1"),
            line2: ensureOptionalString(body.address?.line2, 200),
            postal_code: ensureString(body.address?.postal_code, "address.postal_code"),
            city: ensureString(body.address?.city, "address.city"),
            country: ensureOptionalString(body.address?.country, 2) ?? "PL",
          }
        : undefined;

    if (type === "locker" && !pickupPointId) {
      throw new Error("Missing pickup_point_id");
    }

    const { data: existing } = await supabaseAdmin
      .from("shipments")
      .select("*")
      .eq("order_id", orderId)
      .eq("carrier", "inpost")
      .maybeSingle();

    if (existing && !replace) {
      return withCors(
        new Response(JSON.stringify({ shipment: existing, reused: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    const payload = buildInpostPayload({
      service_code: serviceCode,
      type,
      receiver: { name: receiverName, phone: receiverPhone, email: receiverEmail },
      pickup_point_id: pickupPointId,
      address,
    });

    const inpostResponse = await createShipment(payload);

    const shipmentRecord = {
      order_id: orderId,
      user_id: userId,
      carrier: "inpost",
      service_code: serviceCode,
      type,
      status: inpostResponse.status ?? "created",
      tracking_number: inpostResponse.tracking_number ?? null,
      inpost_shipment_id: inpostResponse.id ?? null,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      receiver_email: receiverEmail,
      address_line1: address?.line1 ?? null,
      address_line2: address?.line2 ?? null,
      postal_code: address?.postal_code ?? null,
      city: address?.city ?? null,
      country: address?.country ?? "PL",
      pickup_point_id: pickupPointId,
    };

    const { data: created, error } = await supabaseAdmin
      .from("shipments")
      .insert(shipmentRecord)
      .select()
      .single();

    if (error) {
      console.error("Shipment insert error:", error);
      throw new Error("Failed to save shipment");
    }

    return withCors(
      new Response(JSON.stringify({ shipment: created }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (error) {
    console.error("InPost shipment error:", error);
    return withCors(
      new Response(JSON.stringify({ error: "Unable to create shipment" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

serve(handler);
