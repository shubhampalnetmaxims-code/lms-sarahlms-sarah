import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Camera,
  User,
  School,
  Plus
} from "lucide-react";
import CryptoJS from "crypto-js";
import { Student, Invitation, Organization, Level } from "../types";

interface StudentSignupProps {
  token: string;
  onComplete: (student: Student) => void;
  onCancel: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export default function StudentSignup({ token, onComplete, onCancel, showToast }: StudentSignupProps) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      setIsLoading(true);
      try {
        const invitations: Invitation[] = JSON.parse(localStorage.getItem("aquire_invitations") || "[]");
        const invite = invitations.find(i => i.token === token);

        if (!invite) {
          setError("Invalid invitation token.");
          return;
        }

        if (invite.used) {
          setError("This invitation has already been used.");
          return;
        }

        if (new Date(invite.expires) < new Date()) {
          setError("This invitation has expired.");
          return;
        }

        setInvitation(invite);

        // Load student to get level_id
        const students: Student[] = JSON.parse(localStorage.getItem("aquire_students") || "[]");
        const student = students.find(s => s.email === invite.email);
        
        if (student) {
          const levels: Level[] = JSON.parse(localStorage.getItem("aquire_levels") || "[]");
          const studentLevel = levels.find(l => l.id === student.level_id);
          setLevel(studentLevel || null);
        }

        const org = localStorage.getItem("aquire_organization");
        if (org) setOrganization(JSON.parse(org));

      } catch (err) {
        setError("An error occurred while validating your invitation.");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Photo must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (getPasswordStrength() < 100) {
      showToast("Please use a stronger password", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const students: Student[] = JSON.parse(localStorage.getItem("aquire_students") || "[]");
      const studentIdx = students.findIndex(s => s.email === invitation?.email);

      if (studentIdx === -1) {
        showToast("Student record not found", "error");
        return;
      }

      const passwordHash = CryptoJS.SHA256(password).toString();
      const updatedStudent: Student = {
        ...students[studentIdx],
        status: 'active',
        password_hash: passwordHash,
        profile_pic: profilePic || undefined,
        joined: new Date().toISOString()
      };

      students[studentIdx] = updatedStudent;
      localStorage.setItem("aquire_students", JSON.stringify(students));

      // Mark invitation as used
      const invitations: Invitation[] = JSON.parse(localStorage.getItem("aquire_invitations") || "[]");
      const updatedInvitations = invitations.map(i => i.token === token ? { ...i, used: true } : i);
      localStorage.setItem("aquire_invitations", JSON.stringify(updatedInvitations));

      showToast("Account created successfully!", "success");
      onComplete(updatedStudent);
    } catch (err) {
      showToast("Failed to create account", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aquire-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aquire-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-medium">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aquire-black p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[32px] p-10 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-aquire-black mb-2">Invalid Invitation</h2>
          <p className="text-aquire-grey-med mb-8">{error}</p>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-aquire-black text-white rounded-2xl font-bold hover:bg-aquire-black/90 transition-all"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-aquire-black p-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Info */}
        <div className="md:w-5/12 bg-aquire-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Welcome to {organization?.name || "Aquire Academy"}</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8">
              Join your classmates and start your learning journey today. Complete your profile to get started.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Student</p>
                  <p className="text-sm font-bold">{invitation?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Level</p>
                  <p className="text-sm font-bold">{level?.name || "Assigned Level"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
            <p className="text-xs opacity-60">© 2024 Aquire Global Academy</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10 md:p-12">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-aquire-black mb-2">Complete Signup</h3>
            <p className="text-aquire-grey-med text-sm">Set your password and profile picture.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-aquire-grey-light flex items-center justify-center border-2 border-dashed border-aquire-border overflow-hidden group-hover:border-aquire-primary transition-all">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-aquire-grey-med w-8 h-8 group-hover:text-aquire-primary transition-colors" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-aquire-primary text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-aquire-primary-hover transition-all">
                  <Plus size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <p className="text-[10px] text-aquire-grey-med mt-3 font-bold uppercase tracking-widest">Upload Profile Photo</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
                  <input 
                    type="email" 
                    value={invitation?.email} 
                    disabled 
                    className="input-field w-full pl-12 bg-aquire-grey-light/50 text-aquire-grey-med cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pl-12 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med hover:text-aquire-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-aquire-grey-med">Strength</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      strength === 100 ? "text-emerald-500" : strength >= 50 ? "text-amber-500" : "text-red-500"
                    }`}>
                      {strength === 100 ? "Strong" : strength >= 50 ? "Medium" : "Weak"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-aquire-grey-light rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full transition-all duration-500 ${strength >= 25 ? "bg-red-500" : "bg-transparent"}`} style={{ width: '25%' }} />
                    <div className={`h-full transition-all duration-500 ${strength >= 50 ? "bg-amber-500" : "bg-transparent"}`} style={{ width: '25%' }} />
                    <div className={`h-full transition-all duration-500 ${strength >= 75 ? "bg-emerald-400" : "bg-transparent"}`} style={{ width: '25%' }} />
                    <div className={`h-full transition-all duration-500 ${strength >= 100 ? "bg-emerald-600" : "bg-transparent"}`} style={{ width: '25%' }} />
                  </div>
                  <p className="text-[10px] text-aquire-grey-med mt-2">
                    Use 8+ characters with uppercase, numbers & symbols.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field w-full pl-12"
                    placeholder="••••••••"
                    required
                  />
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || strength < 100 || password !== confirmPassword}
              className="w-full py-4 bg-aquire-primary text-white rounded-2xl font-bold shadow-lg shadow-aquire-primary/20 hover:bg-aquire-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create My Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
