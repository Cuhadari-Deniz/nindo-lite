import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { InfluencerFilters } from "./components/influencer-filters";
import {
  InfluencerDataTable,
  useInfluencerTable,
} from "./components/influencer-table";
import { TriggerInfluencerUpdateButton } from "./components/influencer-update-button";
import { useTRPC } from "./trpc/react";

export default function App() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.influencer.getAll.queryOptions());

  // create mutable copy and memoize to prevent infinite render loops
  const tableData = useMemo(() => data.map((item) => ({ ...item })), [data]);

  const table = useInfluencerTable(tableData);

  return (
    <div className="flex flex-col gap-2 max-w-4xl p-16 m-auto">
      <TriggerInfluencerUpdateButton className="w-fit" />

      <InfluencerFilters table={table} />

      <InfluencerDataTable table={table} />
    </div>
  );
}
