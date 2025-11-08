import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import CreateDistributorModal from "@/components/CreateDistributorModal";
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
import { Users, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  balance: number;
  createdAt: string;
}

const MasterDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [distributors] = useState<Distributor[]>([
    { id: "1", name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+91 98765 43210", status: "active", balance: 45000, createdAt: "2024-01-15" },
    { id: "2", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", status: "active", balance: 38500, createdAt: "2024-01-20" },
    { id: "3", name: "Amit Patel", email: "amit@example.com", phone: "+91 98765 43212", status: "inactive", balance: 12000, createdAt: "2024-02-01" },
  ]);


  const stats = [
    {
      title: "Total Distributors",
      value: distributors.length,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Distributors",
      value: distributors.filter((d) => d.status === "active").length,
      icon: Activity,
      color: "text-success",
    },
    {
      title: "Total Distribution",
      value: `₹${distributors.reduce((sum, d) => sum + d.balance, 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-secondary",
    },
  ];

  return (
    <DashboardLayout role="master" walletBalance={250000}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Distributors Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Your Distributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Balance</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributors.map((distributor, index) => (
                    <TableRow
                      key={distributor.id}
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                    >
                      <TableCell className="font-medium">{distributor.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {distributor.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {distributor.phone}
                      </TableCell>
                      <TableCell className="font-semibold text-success">
                        ₹{distributor.balance.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            distributor.status === "active" ? "default" : "secondary"
                          }
                          className={
                            distributor.status === "active"
                              ? "bg-success/10 text-success border-success"
                              : ""
                          }
                        >
                          {distributor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(distributor.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateDistributorModal open={modalOpen} onOpenChange={setModalOpen} onSuccess={() => {}} />
    </DashboardLayout>
  );
};

export default MasterDashboard;
