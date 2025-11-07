import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["master", "distributor"], {
    required_error: "Please select a role",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      const endpoint = data.role === "master" ? "/api/master/login" : "/api/distributor/login";
      
      // Mock successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.role === "master" ? "Master Distributor" : "Distributor"}!`,
      });

      // Redirect to appropriate dashboard
      navigate(data.role === "master" ? "/master" : "/distributor");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-light p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-heading text-gradient">
            PayBazaar
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to access your distributor panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
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
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup
                onValueChange={(value) => setValue("role", value as "master" | "distributor")}
                className="space-y-3"
              >
                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === "master"
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setValue("role", "master")}
                >
                  <RadioGroupItem value="master" id="master" />
                  <Label
                    htmlFor="master"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Master Distributor</div>
                      <div className="text-xs text-muted-foreground">
                        Manage distributors and operations
                      </div>
                    </div>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === "distributor"
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setValue("role", "distributor")}
                >
                  <RadioGroupItem value="distributor" id="distributor" />
                  <Label
                    htmlFor="distributor"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Wallet className="w-5 h-5 text-secondary" />
                    <div>
                      <div className="font-semibold">Distributor</div>
                      <div className="text-xs text-muted-foreground">
                        Manage retailers and sales
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
