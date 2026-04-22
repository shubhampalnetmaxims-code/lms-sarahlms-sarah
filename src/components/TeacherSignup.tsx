import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  Camera,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Teacher, Invitation } from "../types";
import CryptoJS from "crypto-js";

interface TeacherSignupProps {
  token: string;
  onComplete: (teacher: Teacher) => void;
  onCancel: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export default function TeacherSignup({ token, onComplete, onCancel, showToast }: TeacherSignupProps) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = () => {
      const savedInvitations: Invitation[] = JSON.parse(localStorage.getItem("aquire_invitations") || "[]");
      const found = savedInvitations.find(i => i.token === token && !i.used);

      if (!found) {
        setError("Invalid or expired invitation token.");
        setIsLoading(false);
        return;
      }

      const expiry = new Date(found.expires);
      if (expiry < new Date()) {
        setError("Invitation token has expired.");
        setIsLoading(false);
        return;
      }

      setInvitation(found);
      setIsLoading(false);
    };

    validateToken();
  }, [token]);

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const strength = calculatePasswordStrength(password);
    if (strength < 100) {
      showToast("Password is not strong enough", "error");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const teachers: Teacher[] = JSON.parse(localStorage.getItem("aquire_teachers") || "[]");
    const invitations: Invitation[] = JSON.parse(localStorage.getItem("aquire_invitations") || "[]");

    const passwordHash = CryptoJS.SHA256(password).toString();
    
    // Update teacher record
    const updatedTeachers = teachers.map(t => {
      if (t.email === invitation?.email) {
        return {
          ...t,
          status: 'active' as const,
          profile_pic: profilePic,
          password_hash: passwordHash,
          invitation_token: undefined,
          token_expires: undefined
        };
      }
      return t;
    });

    // Mark invitation as used
    const updatedInvitations = invitations.map(i => {
      if (i.token === token) {
        return { ...i, used: true };
      }
      return i;
    });

    localStorage.setItem("aquire_teachers", JSON.stringify(updatedTeachers));
    localStorage.setItem("aquire_invitations", JSON.stringify(updatedInvitations));

    const finalTeacher = updatedTeachers.find(t => t.email === invitation?.email);
    if (finalTeacher) {
      showToast("Account created successfully!", "success");
      onComplete(finalTeacher);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-aquire-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Invalid Invitation</h2>
        <p className="text-white/60 max-w-md mb-8">{error}</p>
        <button onClick={onCancel} className="btn-primary">Return to Login</button>
      </div>
    );
  }

  const strength = calculatePasswordStrength(password);
  const strengthColor = strength === 0 ? "bg-white/10" : strength < 50 ? "bg-red-500" : strength < 100 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-aquire-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-aquire-primary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Signup</h1>
          <p className="text-white/50">Complete your profile to join the academy.</p>
        </div>

        <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Pic */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-aquire-primary/50">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white/20" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-aquire-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                  <Camera size={20} />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Profile Picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 ml-1">Full Name</label>
                <input 
                  type="text" 
                  disabled 
                  value={invitation?.name} 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 ml-1">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  value={invitation?.email} 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-white/70 ml-1 transition-colors group-focus-within:text-aquire-primary">
                  Set Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-aquire-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-lg focus:border-aquire-primary focus:ring-4 focus:ring-aquire-primary/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/40">Strength</span>
                      <span className={strength === 100 ? "text-emerald-500" : "text-amber-500"}>
                        {strength === 0 ? "None" : strength < 50 ? "Weak" : strength < 100 ? "Good" : "Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                        className={`h-full ${strengthColor} transition-all duration-500`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-white/70 ml-1 transition-colors group-focus-within:text-aquire-primary">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-aquire-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-lg focus:border-aquire-primary focus:ring-4 focus:ring-aquire-primary/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-aquire-primary text-white font-bold text-lg rounded-2xl shadow-2xl shadow-aquire-primary/20 hover:bg-aquire-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Complete Signup
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
