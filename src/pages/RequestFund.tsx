import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const RequestFund = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("userRole");
  const walletBalance = 50000; // Mock wallet balance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Request Submitted",
        description: `Your fund request for ₹${parseFloat(amount).toLocaleString("en-IN")} has been submitted successfully.`,
      });
      navigate(role === "master" ? "/master" : "/distributor");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(role === "master" ? "/master" : "/distributor")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-wallet-bg border-2 border-wallet-border">
              <Wallet className="w-5 h-5 text-wallet-text" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-medium">Balance</div>
                <div className="text-lg font-heading font-bold text-wallet-text">
                  ₹{walletBalance.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
              Request Funds
            </h1>
            <p className="text-muted-foreground">
              Submit a request to add funds to your wallet
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="gradient-primary text-primary-foreground rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Fund Request Form</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Enter the amount and reason for your request
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-semibold">
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the amount you wish to request
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-base font-semibold">
                    Reason for Request
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why you need these funds..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="min-h-32 resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide a detailed explanation for your fund request
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-sm">Request Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Balance:</span>
                      <span className="font-semibold">₹{walletBalance.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested Amount:</span>
                      <span className="font-semibold text-primary">
                        {amount ? `₹${parseFloat(amount).toLocaleString("en-IN")}` : "₹0"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold">Balance After Approval:</span>
                      <span className="font-bold text-success">
                        ₹{(walletBalance + (parseFloat(amount) || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(role === "master" ? "/master" : "/distributor")}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary hover:opacity-90"
                    disabled={loading || !amount || !reason}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RequestFund;
