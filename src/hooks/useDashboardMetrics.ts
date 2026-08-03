import { useMemo } from "react";
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData";
import { computeDashboardMetrics } from "@/lib/dashboard-metrics";

/** Single source of truth for every number rendered in the dashboard. */
export function useDashboardMetrics() {
  // `isPending` (not `isLoading`) so the server render shows skeletons rather
  // than a flash of zeroes — the query only ever runs on the client.
  const { data, isPending, error, refetch, isFetching, dataUpdatedAt } = useSpreadsheetData();

  const metrics = useMemo(() => computeDashboardMetrics(data), [data]);

  return {
    metrics,
    rows: data,
    isLoading: isPending,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  };
}
