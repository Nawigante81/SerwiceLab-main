import { InpostClient } from "./inpostClient.ts";
import { mockMethods, mockPoints, mockTracking } from "./inpostMock.ts";
import { sanitizeQuery } from "./validation.ts";

const isMock = (Deno.env.get("MOCK_INPOST") ?? "").toLowerCase() === "true";

const getClient = () => {
  const baseUrl = Deno.env.get("INPOST_API_URL") ?? "";
  const token = Deno.env.get("INPOST_TOKEN") ?? "";
  const orgId = Deno.env.get("INPOST_ORG_ID") ?? undefined;
  if (!baseUrl || !token) {
    throw new Error("Missing InPost configuration");
  }
  return new InpostClient({ baseUrl, token, orgId });
};

export const listShippingMethods = async () => {
  if (isMock) return mockMethods;
  return mockMethods;
};

export const searchPoints = async (params: {
  query?: string | null;
  lat?: number | null;
  lng?: number | null;
  type?: string | null;
}) => {
  if (isMock) {
    if (!params.type) return mockPoints;
    return mockPoints.filter((point) =>
      params.type === "locker" ? point.type === "locker" : point.type !== "locker"
    );
  }

  const client = getClient();
  const query = sanitizeQuery(params.query) ?? "";
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("q", query);
  if (params.lat && params.lng) {
    searchParams.set("latitude", params.lat.toString());
    searchParams.set("longitude", params.lng.toString());
  }
  if (params.type) searchParams.set("type", params.type);

  const response = await client.request(`/points?${searchParams.toString()}`, { method: "GET" });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`InPost points error: ${errorText}`);
  }
  return await response.json();
};

export const createShipment = async (payload: Record<string, unknown>) => {
  if (isMock) {
    return {
      id: "mock-shipment-id",
      tracking_number: mockTracking.tracking_number,
      status: "created",
      label_url: null,
    };
  }

  const client = getClient();
  const response = await client.request("/shipments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`InPost shipment error: ${errorText}`);
  }
  return await response.json();
};

export const getShipmentLabel = async (shipmentId: string, format = "pdf") => {
  if (isMock) {
    return new Response("Mock label", {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  }

  const client = getClient();
  const response = await client.request(`/shipments/${shipmentId}/label?format=${format}`, {
    method: "GET",
    headers: { Accept: "application/pdf" },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`InPost label error: ${errorText}`);
  }
  return response;
};

export const trackShipment = async (tracking: string) => {
  if (isMock) return mockTracking;

  const client = getClient();
  const response = await client.request(`/tracking/${tracking}`, { method: "GET" });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`InPost tracking error: ${errorText}`);
  }
  return await response.json();
};
