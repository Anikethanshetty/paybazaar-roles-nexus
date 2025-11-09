import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DollarSign, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/DashboardLayout"

const RequestFund = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const role = localStorage.getItem("userRole")
  const walletBalance = 50000 // Mock balance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Request Submitted",
        description: `Your fund request for ₹${parseFloat(amount).toLocaleString(
          "en-IN"
        )} has been submitted successfully.`,
      })
      navigate(role === "master" ? "/master" : "/distributor")
    }, 1500)
  }

  return (
    <DashboardLayout role={role} walletBalance={walletBalance}>
      <div className="max-w-2xl mx-auto w-full">
     
        <Card className="border-0 shadow-lg">
          <CardHeader className="gradient-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-3">
              
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
                  disabled={loading || !amount || !reason}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default RequestFund
