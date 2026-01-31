import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/services/orderService";

import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Calculate Metrics
  const totalOmzet = orders.reduce((acc, order) => acc + order.total_price, 0);
  const totalTransaksi = orders.length;

  // Calculate Best Selling Menu
  const itemCounts: Record<string, number> = {};
  orders.forEach(order => {
    order.order_items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });

  let bestSellingMenu = "-";
  let maxQuantity = 0;

  Object.entries(itemCounts).forEach(([name, quantity]) => {
    if (quantity > maxQuantity) {
      maxQuantity = quantity;
      bestSellingMenu = name;
    }
  });

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-5 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Omzet</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalOmzet)
            )}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jumlah Transaksi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              totalTransaksi
            )}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Menu Terlaris</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl truncate" title={bestSellingMenu}>
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              bestSellingMenu
            )}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
