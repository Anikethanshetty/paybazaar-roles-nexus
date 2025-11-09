import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const retailerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  phone: z.string().regex(/^[1-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

type RetailerFormData = z.infer<typeof retailerSchema>

interface DecodedToken {
  data: {
    distributor_id: string
    distributor_unique_id: string
    distributor_name: string
    master_distributor_id: string
    admin_id: string
  }
  exp: number
}

const CreateRetailerPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const role = localStorage.getItem("userRole") || "distributor"
  const token = localStorage.getItem("authToken")
  const walletBalance = 85000

  if (!token) {
    navigate("/login")
    return null
  }

  // Decode JWT to extract IDs
  let masterDistributorId = ""
  let distributorId = ""
  let adminId = ""

  try {
    const decoded: DecodedToken = jwtDecode(token)
    masterDistributorId = decoded.data.master_distributor_id
    distributorId = decoded.data.distributor_id
    adminId = decoded.data.admin_id
  } catch (err) {
    console.error("Token decode error:", err)
    toast({
      title: "Invalid Token",
      description: "Please log in again.",
      variant: "destructive",
    })
    localStorage.clear()
    navigate("/login")
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetailerFormData>({
    resolver: zodResolver(retailerSchema),
  })

  const onSubmit = async (data: RetailerFormData) => {
    try {
      const payload = {
        master_distributor_id: masterDistributorId,
        admin_id: adminId,
        distributor_id: distributorId,
        user_name: data.name,
        user_email: data.email,
        user_password: data.password,
        user_phone: data.phone,
        user_address: data.address,
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/distributor/create/user`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.status === "success") {
        toast({
          title: "Retailer created successfully",
          description: `${data.name} has been added to your network.`,
        })
        reset()
      } else {
        throw new Error(response.data.message || "Failed to create retailer")
      }
    } catch (error: any) {
      console.error("Create Retailer Error:", error)
      toast({
        title: "Failed to create retailer",
        description:
          error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout role={role} walletBalance={walletBalance}>
      <div className="flex flex-col max-w-2xl mx-auto">
        <Card>
          <CardHeader className="gradient-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-2xl">Create New Retailer</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-1">
                  Add a new retailer to your network.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Ramesh Traders"
                  {...register("name")}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ramesh@traders.com"
                  {...register("email")}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  {...register("phone")}
                  className="h-11"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Shop Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Bengaluru"
                  {...register("address")}
                  className="h-11"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Retailer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </DashboardLayout>
  )
}

export default CreateRetailerPage
