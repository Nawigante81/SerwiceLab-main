import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InpostMethod, InpostPoint } from "@/lib/inpost-types";

export const useInpostMethods = () =>
  useQuery({
    queryKey: ["inpost-methods"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("inpost-methods", {
        method: "GET",
      });
      if (error) throw error;
      return (data?.methods ?? []) as InpostMethod[];
    },
  });

export const useInpostPoints = (params: {
  query?: string;
  lat?: number | null;
  lng?: number | null;
  type?: string;
}) =>
  useQuery({
    queryKey: ["inpost-points", params],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.query) search.set("query", params.query);
      if (params.lat) search.set("lat", params.lat.toString());
      if (params.lng) search.set("lng", params.lng.toString());
      if (params.type) search.set("type", params.type);

      const { data, error } = await supabase.functions.invoke(
        `inpost-points?${search.toString()}`,
        { method: "GET" }
      );
      if (error) throw error;
      return (data?.points ?? []) as InpostPoint[];
    },
    enabled: Boolean(params.query || (params.lat && params.lng)),
  });
