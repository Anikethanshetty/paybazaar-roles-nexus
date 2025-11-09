import { useState, useEffect } from "react"
import axios from "axios"
import {jwtDecode} from "jwt-decode"
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

interface TokenData {
  data: {
    admin_id: string
    master_distributor_id?: string
    distributor_id?: string
  }
  exp: number
}

const RequestFunds = () => {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch: "",
    utr_number: "",
    remarks: "",
  })

  const [loading, setLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState(50000)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  // 🔐 Decode token and check session validity
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      redirectTo("/login")
      return
    }

    try {
      const decoded: TokenData = jwtDecode(token)

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken")
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        })
        redirectTo("/login")
        return
      }

      setTokenData(decoded)
      setRole(userRole)
      setIsReady(true)
    } catch (err) {
      console.error("Token decode error:", err)
      localStorage.removeItem("authToken")
      redirectTo("/login")
    }
  }, [toast])

  // ✳️ Safe client-side redirection without page reload
  const redirectTo = (path: string) => {
    window.history.pushState({}, "", path)
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  // 📝 Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // 🚀 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenData || !role) return

    const requester_id =
      role === "master"
        ? tokenData.data.master_distributor_id
        : tokenData.data.distributor_id

    const requester_type =
      role === "master" ? "MASTER_DISTRIBUTOR" : "DISTRIBUTOR"

    const payload = {
      admin_id: tokenData.data.admin_id,
      requester_id,
      requester_type,
      ...formData,
      request_status: "pending",
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/fund/request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      toast({
        title: "Fund Request Submitted",
        description:
          res.data.message || "Your request has been successfully submitted.",
      })

      redirectTo(role === "master" ? "/master" : "/distributor")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Request Failed",
        description:
          err.response?.data?.message || "Something went wrong. Try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ⏳ Wait until token is verified
  if (!isReady) return null

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
                {[
                  { id: "amount", label: "Amount (₹)", type: "number" },
                  { id: "bank_name", label: "Bank Name" },
                  { id: "account_number", label: "Account Number" },
                  { id: "ifsc_code", label: "IFSC Code" },
                  { id: "bank_branch", label: "Bank Branch" },
                  { id: "utr_number", label: "UTR Number" },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-base font-semibold">
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type || "text"}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
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
                    redirectTo(role === "master" ? "/master" : "/distributor")
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
  )
}

export default RequestFunds
