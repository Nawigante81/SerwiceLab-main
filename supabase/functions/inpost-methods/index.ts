import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, withCors } from "../_shared/cors.ts";
import { listShippingMethods } from "../_shared/inpostService.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  try {
    const methods = await listShippingMethods();
    const ordered = [...methods].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return withCors(
      new Response(JSON.stringify({ methods: ordered }), { status: 200, headers: { "Content-Type": "application/json" } })
    );
  } catch (error) {
    console.error("InPost methods error:", error);
    return withCors(
      new Response(JSON.stringify({ error: "Unable to fetch shipping methods" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

serve(handler);
