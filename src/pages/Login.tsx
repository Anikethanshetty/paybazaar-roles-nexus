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
import { Wallet, ShieldCheck, Eye, EyeOff, Clock, Headphones } from "lucide-react";
import paybazarLogo from "@/assets/paybazar-logo.png";

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
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <img src={paybazarLogo} alt="PayBazaar" className="h-12 mb-8" />
            <h1 className="text-5xl font-heading font-bold mb-6 leading-tight">
              PayBazaar: Secure & Reliable<br />Payment Service
            </h1>
            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              At PAYBAZAAR, we are more than just a financial institution; we are a 
              catalyst for inclusive growth and empowerment. We harness technology 
              to democratize financial services, making them reachable to every 
              corner of the nation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Quick settlement in 1 hour</p>
                <p className="text-sm text-white/70">Fast and reliable transactions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">24/7 Available</p>
                <p className="text-sm text-white/70">Round the clock support</p>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Company Info
              </h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>📧 info@paybazaar.in</p>
                <p>📞 +91 9319187762</p>
                <p>📍 Paybazaar Technologies Pvt Ltd, Office No-304, Plot No-2 T/F Netaji Subhash Marg, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8 lg:hidden">
            <img src={paybazarLogo} alt="PayBazaar" className="h-10 mx-auto mb-4" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome to PayBazaar!
            </h2>
            <p className="text-muted-foreground">
              Sign in to manage your payments
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl border p-8">
            <h3 className="text-2xl font-semibold mb-6">Sign In</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email and password to continue
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="h-11 bg-input border-border"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-11 bg-input border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Role</Label>
                <RadioGroup
                  onValueChange={(value) => setValue("role", value as "master" | "distributor")}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover-glow ${
                      selectedRole === "master"
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/40"
                    }`}
                    onClick={() => setValue("role", "master")}
                  >
                    <RadioGroupItem value="master" id="master" />
                    <Label
                      htmlFor="master"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Master Distributor</div>
                        <div className="text-xs text-muted-foreground">
                          Manage distributors and operations
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover-glow ${
                      selectedRole === "distributor"
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/40"
                    }`}
                    onClick={() => setValue("role", "distributor")}
                  >
                    <RadioGroupItem value="distributor" id="distributor" />
                    <Label
                      htmlFor="distributor"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Distributor</div>
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity font-semibold text-base shadow-lg"
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
