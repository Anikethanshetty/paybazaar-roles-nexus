import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Headphones,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import paybazarLogo from "@/assets/paybazar-logo.png";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [showPassword, setShowPassword] = useState(false);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });

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
    <div className="h-screen w-screen overflow-hidden grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#0d3154] px-8 text-white">
        <div className="flex flex-col items-center max-w-md text-center">
          <img
            src="/login-page.png"
            alt="PayBazaar Illustration"
            className="w-48 h-44 object-contain"
          />
          <h2 className="text-2xl font-bold mt-6">
            PayBazaar: Secure & Reliable Payments
          </h2>
          <p className="text-slate-200 text-xs mt-2 leading-relaxed">
            PAYBAZAAR empowers inclusive financial growth through technology,
            reaching every corner of the nation.
          </p>

          <ul className="flex justify-center gap-6 text-xs text-slate-200 mt-4">
            <li className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-white" /> 1-hour settlements
            </li>
            <li className="flex items-center gap-1">
              <Headphones className="w-4 h-4 text-white" /> 24/7 Support
            </li>
          </ul>

          <Card className="w-full shadow-lg border-0 rounded-xl bg-white/90 backdrop-blur-md mt-8">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#0d3154] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0d3154]" /> Company Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-700">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0d3154]" /> info@paybazaar.in
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0d3154]" /> +91 9319187762
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0d3154] mt-1" />
                Paybazaar Technologies Pvt Ltd, Office No-304, Plot 2, Delhi
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6 lg:hidden">
            <img src={paybazarLogo} alt="PayBazaar" className="h-8 mx-auto mb-3" />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to PayBazaar!
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your payments
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl border p-6">
            <h3 className="text-xl font-semibold mb-4">Sign In</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="h-10"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Select Role</Label>
                <RadioGroup
                  onValueChange={(value) =>
                    setValue("role", value as "master" | "distributor")
                  }
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      selectedRole === "master"
                        ? "border-primary bg-accent/30"
                        : "border-border"
                    }`}
                    onClick={() => setValue("role", "master")}
                  >
                    <RadioGroupItem value="master" id="master" />
                    <Label
                      htmlFor="master"
                      className="flex items-center gap-2 cursor-pointer flex-1 text-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-primary" /> Master Distributor
                    </Label>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      selectedRole === "distributor"
                        ? "border-primary bg-accent/30"
                        : "border-border"
                    }`}
                    onClick={() => setValue("role", "distributor")}
                  >
                    <RadioGroupItem value="distributor" id="distributor" />
                    <Label
                      htmlFor="distributor"
                      className="flex items-center gap-2 cursor-pointer flex-1 text-sm"
                    >
                      <Wallet className="w-4 h-4 text-secondary" /> Distributor
                    </Label>
                  </div>
                </RadioGroup>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-10 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
