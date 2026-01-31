import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "../lib/store/data.json";


export default function Dashboard() {
  return (
    <>
    <div className="flex flex-col gap-4">
      <SectionCards/>
      <ChartAreaInteractive/>
      <DataTable data={data} />
    </div>
    </>
  )
}
