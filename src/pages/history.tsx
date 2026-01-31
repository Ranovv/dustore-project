import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/services/orderService";
import { OrdersDataTable, columns } from "@/components/orders-data-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function HistoryPage() {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const generatePDF = () => {
        if (!orders || orders.length === 0) {
            toast.error("Tidak ada data untuk dicetak");
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Laporan Pesanan - Qryawan Cafe", 14, 22);

        doc.setFontSize(11);
        doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, 30);

        // Table
        const tableData = orders.map((order) => [
            `#${order.id}`,
            order.created_at ? new Date(order.created_at).toLocaleDateString() : "-",
            order.customer_name,
            `Rp ${order.total_price.toLocaleString()}`,
            order.status,
            order.order_items.length
        ]);

        autoTable(doc, {
            head: [["Order ID", "Tanggal", "Customer", "Total", "Status", "Items"]],
            body: tableData,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
        });

        // Save
        doc.save(`Laporan_Pesanan_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Laporan PDF berhasil diunduh");
    };

    if (isLoading) return <div className="p-8">Loading orders...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading orders: {(error as Error).message}</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Laporan Pesanan</h1>
                    <p className="text-muted-foreground">
                        Riwayat transaksi dan laporan penjualan.
                    </p>
                </div>
                <Button onClick={generatePDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>

            <div className="bg-background rounded-lg shadow-sm">
                <OrdersDataTable columns={columns} data={orders || []} isLoading={isLoading} />
            </div>
        </div>
    );
}
