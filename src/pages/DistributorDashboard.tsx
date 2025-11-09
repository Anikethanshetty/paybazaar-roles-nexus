import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import CreateRetailerModal from "@/components/CreateRetailerModal";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Store, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  sales: number;
  createdAt: string;
}

const DistributorDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [retailers] = useState<Retailer[]>([
    {
      id: "1",
      name: "Suresh Store",
      email: "suresh@store.com",
      phone: "+91 98765 43220",
      status: "active",
      sales: 125000,
      createdAt: "2024-02-10",
    },
    {
      id: "2",
      name: "Modern Electronics",
      email: "modern@electronics.com",
      phone: "+91 98765 43221",
      status: "active",
      sales: 98500,
      createdAt: "2024-02-15",
    },
    {
      id: "3",
      name: "City Mart",
      email: "city@mart.com",
      phone: "+91 98765 43222",
      status: "active",
      sales: 87000,
      createdAt: "2024-02-20",
    },
    {
      id: "4",
      name: "Quick Shop",
      email: "quick@shop.com",
      phone: "+91 98765 43223",
      status: "inactive",
      sales: 45000,
      createdAt: "2024-03-01",
    },
  ]);

  const stats = [
    {
      title: "Total Retailers",
      value: retailers.length,
      icon: Store,
      color: "text-secondary",
    },
    {
      title: "Active Retailers",
      value: retailers.filter((r) => r.status === "active").length,
      icon: Activity,
      color: "text-success",
    },
    {
      title: "Total Sales",
      value: `₹${retailers
        .reduce((sum, r) => sum + r.sales, 0)
        .toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <DashboardLayout role="distributor" walletBalance={85000}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Retailers Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-heading">
              Your Retailers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table className="w-full  ">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-center text-gradient-primary">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gradient-primary">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gradient-primary">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gradient-primary">
                      Sales
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gradient-primary">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {retailers.map((retailer, index) => (
                    <TableRow
                      key={retailer.id}
                      className={` hover:bg-muted/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-center py-3 text-muted-foreground">
                        {retailer.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-center py-3">
                        {retailer.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-center py-3">
                        {retailer.phone}
                      </TableCell>
                      <TableCell className="font-semibold text-muted-foreground text-center py-3">
                        ₹{retailer.sales.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-center py-3">
                        {new Date(retailer.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <CreateRetailerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {}}
      /> */}
    </DashboardLayout>
  );
};

export default DistributorDashboard;
