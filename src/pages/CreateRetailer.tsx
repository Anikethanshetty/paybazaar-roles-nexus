import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const retailerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type RetailerFormData = z.infer<typeof retailerSchema>;

const CreateRetailerPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "distributor";
  const walletBalance = 85000; // mock wallet balance

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetailerFormData>({
    resolver: zodResolver(retailerSchema),
  });

  const onSubmit = async (data: RetailerFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Retailer created successfully",
        description: `${data.name} has been added to your network.`,
      });

      reset();
    } catch (error) {
      toast({
        title: "Failed to create retailer",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role={role} walletBalance={walletBalance}>
      <div className="flex flex-col max-w-2xl mx-auto ">
        {/* Title Section */}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Ramesh Traders"
                  {...register("name")}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ramesh@traders.com"
                  {...register("email")}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register("phone")}
                  className="h-11"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Shop Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Bengaluru"
                  {...register("address")}
                  className="h-11"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
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

        {/* Retailer Form */}

        <Toaster />
      </div>
    </DashboardLayout>
  );
};

export default CreateRetailerPage;
