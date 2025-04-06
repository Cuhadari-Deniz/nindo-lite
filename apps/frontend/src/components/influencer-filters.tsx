import type { Table } from "@tanstack/table-core";
import { FilterIcon } from "lucide-react";
import { InfluencerData } from "./influencer-table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PercentageInput } from "./ui/percentInput";

export function InfluencerFilters({ table }: { table: Table<InfluencerData> }) {
  return (
    <div className="flex gap-2">
      <Input
        className="max-w-3xl"
        placeholder="Search by name..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
      />
      <NumberFilters table={table} />
    </div>
  );
}

type OptionalNumberRangeTuple =
  | [number | undefined, number | undefined]
  | undefined;

function NumberFilters({ table }: { table: Table<InfluencerData> }) {
  const getFilterValue = (
    field: keyof InfluencerData,
    rangeType: "min" | "max"
  ) => {
    const filterValues = table.getColumn(field)?.getFilterValue() as
      | [number, number]
      | undefined;

    const value = rangeType === "min" ? filterValues?.[0] : filterValues?.[1];

    return value ?? "";
  };

  const updateFilterValue = (
    field: keyof InfluencerData,
    rangeType: "min" | "max",
    stringValue: string
  ) => {
    let newValue: number | undefined = undefined;
    if (stringValue != "") {
      newValue = Number(stringValue);
    }

    const oldValues = table
      .getColumn(field)
      ?.getFilterValue() as OptionalNumberRangeTuple;
    const oldMin = oldValues?.[0];
    const oldMax = oldValues?.[1];

    table
      .getColumn(field)
      ?.setFilterValue([
        rangeType === "min" ? newValue : oldMin,
        rangeType === "max" ? newValue : oldMax,
      ]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex gap-2">
          <FilterIcon /> Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-6 grid grid-cols-[12rem_8rem_8rem] w-fit gap-x-2 gap-y-4">
        <Label>Followers</Label>
        <Input
          type="number"
          placeholder="Min"
          step={1}
          min={0}
          className="h-8"
          value={getFilterValue("followerCount", "min")}
          onChange={(e) =>
            updateFilterValue("followerCount", "min", e.target.value)
          }
        />
        <Input
          type="number"
          placeholder="Min"
          step={1}
          min={0}
          className="h-8"
          value={getFilterValue("followerCount", "max")}
          onChange={(e) =>
            updateFilterValue("followerCount", "max", e.target.value)
          }
        />

        <Label>avg. Watchtime</Label>
        <PercentageInput
          placeholder="Min %"
          value={
            (
              table
                .getColumn("avgWatchtime")
                ?.getFilterValue() as OptionalNumberRangeTuple
            )?.[0]
          }
          onChange={(value) => {
            const oldValues = table
              .getColumn("avgWatchtime")
              ?.getFilterValue() as [number, number] | undefined;
            const oldMax = oldValues?.[1] ?? undefined;
            table.getColumn("avgWatchtime")?.setFilterValue([value, oldMax]);
          }}
        />
        <PercentageInput
          placeholder="Max %"
          value={
            (
              table
                .getColumn("avgWatchtime")
                ?.getFilterValue() as OptionalNumberRangeTuple
            )?.[1]
          }
          onChange={(value) => {
            const oldValues = table
              .getColumn("avgWatchtime")
              ?.getFilterValue() as [number, number] | undefined;
            const oldMin = oldValues?.[0] ?? undefined;
            table.getColumn("avgWatchtime")?.setFilterValue([oldMin, value]);
          }}
        />

        <Label>avg. Impressions / Month</Label>
        <Input
          type="number"
          placeholder="Min"
          step={1}
          min={0}
          className="h-8"
          value={getFilterValue("avgImpressionsPerMonth", "min")}
          onChange={(e) =>
            updateFilterValue("avgImpressionsPerMonth", "min", e.target.value)
          }
        />
        <Input
          type="number"
          placeholder="Min"
          step={1}
          min={0}
          className="h-8"
          value={getFilterValue("avgImpressionsPerMonth", "max")}
          onChange={(e) =>
            updateFilterValue("avgImpressionsPerMonth", "max", e.target.value)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
