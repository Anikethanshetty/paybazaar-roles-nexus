import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

interface TokenData {
  data: {
    admin_id: string;
    master_distributor_id?: string;
    distributor_id?: string;
  };
  exp: number;
}

const RequestFund = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State variables
  const [formData, setFormData] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch: "",
    utr_number: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(50000); // Mock
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Decode token and extract info
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   const userRole = localStorage.getItem("userRole");

  //   if (!token || !userRole) {
  //     // navigate("/login");
  //     return;
  //   }

  //   try {
  //     const decoded: TokenData = jwtDecode(token);
  //     setTokenData(decoded);
  //     setRole(userRole);
  //   } catch (err) {
  //     console.error("Token decode error:", err);
  //     // navigate("/login");
  //   }
  // }, [navigate]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenData || !role) return;

    const requester_id =
      role === "master"
        ? tokenData.data.master_distributor_id
        : tokenData.data.distributor_id;
    const requester_type =
      role === "master" ? "MASTER_DISTRIBUTOR" : "DISTRIBUTOR";

    const payload = {
      admin_id: tokenData.data.admin_id,
      requester_id,
      requester_type,
      amount: formData.amount,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      ifsc_code: formData.ifsc_code,
      bank_branch: formData.bank_branch,
      utr_number: formData.utr_number,
      remarks: formData.remarks,
      request_status: "pending",
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/fund/request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Fund Request Submitted",
        description:
          res.data.message || "Your request has been successfully submitted.",
      });

      navigate(role === "master" ? "/master" : "/distributor");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Request Failed",
        description:
          err.response?.data?.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={role} walletBalance={walletBalance}>
      <div className="max-w-2xl mx-auto w-full">
        <Card className="border-0 shadow-lg">
          <CardHeader className="gradient-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-xl">Fund Request Form</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Fill in the details to request funds
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-semibold">
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bank_name"
                    className="text-base font-semibold"
                  >
                    Bank Name
                  </Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="account_number"
                    className="text-base font-semibold"
                  >
                    Account Number
                  </Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="ifsc_code"
                    className="text-base font-semibold"
                  >
                    IFSC Code
                  </Label>
                  <Input
                    id="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bank_branch"
                    className="text-base font-semibold"
                  >
                    Bank Branch
                  </Label>
                  <Input
                    id="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="utr_number"
                    className="text-base font-semibold"
                  >
                    UTR Number
                  </Label>
                  <Input
                    id="utr_number"
                    value={formData.utr_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-base font-semibold">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(role === "master" ? "/master" : "/distributor")
                  }
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RequestFund;
