
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Link as LinkIcon, Key, Bell, Palette, Settings2,
  Moon, Sun, Camera, Shield, Smartphone, Globe, Copy, Check, Eye, EyeOff,
  ChevronRight, Save, LogOut, Laptop, Plus, Trash2
} from "lucide-react";
import { useToast } from "./ToastProvider";
import { 
  fetchProfile, updateProfile, fetchApiKeys, createApiKey, revokeApiKey, 
  fetchIntegrations, addIntegration, rmdIntegration, fetchPreferences, updatePreferences, updateSecurity 
} from "../lib/api";

export default function SettingsDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState<string|null>(null);

  useEffect(() => {
    const a = localStorage.getItem("avatar");
    if(a) setAvatarPreview(a);
  }, []);

  const [darkMode, setDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast, showModal } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', bio: ''});
  const [prefs, setPrefs] = useState<any>({ theme: 'dark', ui_density: 'Comfortable (Default)', default_ai_model: 'Gemini 1.5 Pro (Recommended)', log_retention: '30 Days', notifications: {} });

  const loadData = async () => {
    const [prof, p] = await Promise.all([fetchProfile(), fetchPreferences()]);
    if (prof) setProfile(prof);
    if (p) { setPrefs(p); setDarkMode(p.theme === 'dark'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "profile") await updateProfile(profile);
      if (["appearance", "system", "notifications"].includes(activeTab)) {
        await updatePreferences({...prefs, theme: darkMode ? 'dark' : 'light'});
      }
      addToast("Settings Saved: Your changes have been updated successfully.");
    } catch (e) {
      addToast("Error: Failed to save settings.");
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: avatarPreview ? <img src={avatarPreview} className="absolute inset-0 w-full h-full object-cover m-0 p-0" style={{ objectFit: "cover" }} /> : <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "integrations", label: "Integrations", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "apikeys", label: "API Keys", icon: <Key className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "system", label: "System", icon: <Settings2 className="w-4 h-4" /> }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${darkMode ? "bg-[#050505] text-slate-200" : "bg-slate-50 text-slate-900"}`}>
      <header className={`sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b backdrop-blur-xl ${darkMode ? "border-white/10 bg-[#050505]/70" : "border-slate-200 bg-white/80"}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Platform Settings</span>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <button onClick={onBack} className="hover:text-indigo-400 transition-colors">Workspace</button>
            <span>/</span>
            <span className={darkMode ? "text-slate-200" : "text-slate-900"}>Settings</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-500/10 transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 border-2 border-[#050505] shadow-sm"></div>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row p-6 lg:p-10 gap-8 lg:gap-12">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1 sticky top-32">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? (darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600") 
                    : (darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className={`p-6 md:p-8 rounded-2xl border shadow-sm transition-colors duration-300 ${darkMode ? "bg-[#0a0a0a] border-white/10 shadow-black/20" : "bg-white border-slate-200"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {activeTab === "profile" && <ProfileSettings darkMode={darkMode} profile={profile} setProfile={setProfile} avatarPreview={avatarPreview} setAvatarPreview={setAvatarPreview} fileInputRef={fileInputRef} addToast={addToast} />}
                {activeTab === "security" && <SecuritySettings darkMode={darkMode} />}
                {activeTab === "integrations" && <IntegrationsSettings darkMode={darkMode} showModal={showModal} />}
                {activeTab === "apikeys" && <APIKeysSettings darkMode={darkMode} showModal={showModal} addToast={addToast} />}
                {activeTab === "notifications" && <NotificationSettings darkMode={darkMode} prefs={prefs} setPrefs={setPrefs} />}
                {activeTab === "appearance" && <AppearanceSettings darkMode={darkMode} setDarkMode={setDarkMode} prefs={prefs} setPrefs={setPrefs} />}
                {activeTab === "system" && <SystemSettings darkMode={darkMode} prefs={prefs} setPrefs={setPrefs} />}
              </motion.div>
            </AnimatePresence>

            {["profile", "appearance", "system", "notifications"].includes(activeTab) && (
              <div className={`mt-10 pt-6 border-t flex justify-end gap-4 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
                <button className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}>Cancel</button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-70"
                >
                  {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const InputField = ({ label, type = "text", placeholder, value, onChange, darkMode }: any) => (
  <div className="space-y-1.5">
    <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value || ""} 
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none ${darkMode ? "bg-black/50 border-white/10 text-white focus:border-indigo-500 focus:bg-white/5" : "bg-white border-slate-300 text-slate-900 focus:border-indigo-500"}`}
    />
  </div>
);

const ToggleSwitch = ({ label, description, checked, onChange, darkMode }: any) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{label}</p>
      {description && <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-500"}`}>{description}</p>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-indigo-500" : darkMode ? "bg-white/10" : "bg-slate-200"}`}
    >
      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

/* --- Profile Settings --- */
const ProfileSettings = ({ darkMode, profile, setProfile, avatarPreview, setAvatarPreview, fileInputRef, addToast }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Update your photo and personal details.</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="flex flex-col items-center gap-3">
        <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center relative group overflow-hidden ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
          {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : <User className={`w-10 h-10 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />}
          <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setAvatarPreview(result);
                    localStorage.setItem('avatar', result);
                    window.dispatchEvent(new Event('avatarChanged'));
                    addToast?.("Avatar updated successfully! View reflected across all panels.");
                };
                reader.readAsDataURL(file);
            }
        }} />
        <button onClick={() => fileInputRef.current?.click()} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Change Avatar</button>

      </div>
      <div className="flex-1 w-full space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField label="First Name" value={profile.first_name} onChange={(v:any) => setProfile({...profile, first_name: v})} darkMode={darkMode} />
          <InputField label="Last Name" value={profile.last_name} onChange={(v:any) => setProfile({...profile, last_name: v})} darkMode={darkMode} />
        </div>
        <InputField label="Email Address" type="email" value={profile.email} onChange={(v:any) => setProfile({...profile, email: v})} darkMode={darkMode} />
        <div className="space-y-1.5">
          <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Bio</label>
          <textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({...profile, bio: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none resize-none ${darkMode ? "bg-black/50 border-white/10 text-white focus:border-indigo-500 focus:bg-white/5" : "bg-white border-slate-300 text-slate-900 focus:border-indigo-500"}`} />
        </div>
      </div>
    </div>
  </div>
);

/* --- Security Settings --- */
const SecuritySettings = ({ darkMode }: any) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const { addToast } = useToast();

  const handleUpdate = async () => {
    try {
      await updateSecurity({current_password: currentPass, new_password: newPass});
      addToast("Updated" + ": " + "Password changed successfully");
      setCurrentPass(""); setNewPass("");
    } catch {
      addToast("Error" + ": " + "Failed to update password");
    }
  };

  return (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">Security</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage your password and security preferences.</p>
    </div>
    <div className="space-y-5 max-w-md">
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">Change Password</h3>
      <InputField label="Current Password" type="password" placeholder="••••••••" value={currentPass} onChange={setCurrentPass} darkMode={darkMode} />
      <InputField label="New Password" type="password" placeholder="••••••••" value={newPass} onChange={setNewPass} darkMode={darkMode} />
      <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium">Update Password</button>
    </div>
  </div>
  );
};

/* --- Integrations Settings --- */
const IntegrationsSettings = ({ darkMode }: any) => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  useEffect(() => { fetchIntegrations().then(res => res && setIntegrations(res)); }, []);

  const handleAdd = async (provider: string) => {
    await addIntegration(provider, "dummy-token-for-" + provider);
    fetchIntegrations().then(setIntegrations);
  };
  const handleRemove = async (provider: string) => {
    await rmdIntegration(provider);
    fetchIntegrations().then(setIntegrations);
  };

  const isConnected = (provider: string) => integrations.some(i => i.provider === provider);

  const ProviderCard = ({ name, provider, icon }: any) => (
      <div className={`p-5 rounded-2xl border flex flex-col justify-between ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <div><p className="font-semibold text-sm">{name}</p></div>
          </div>
          {isConnected(provider) && <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500"><Check className="w-3 h-3" /> Connected</span>}
        </div>
        {isConnected(provider) ? (
          <button onClick={() => handleRemove(provider)} className="w-full py-2 rounded-xl text-sm font-medium border text-red-500 border-red-500/20 bg-red-500/10">Disconnect</button>
        ) : (
          <button onClick={() => handleAdd(provider)} className="w-full py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white">Connect</button>
        )}
      </div>
  );

  return (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">Integrations</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Connect external tools and AI providers.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProviderCard name="GitLab" provider="gitlab" icon={<Globe className="w-6 h-6 text-[#E24329]" />} />
      <ProviderCard name="Google Gemini" provider="gemini" icon={<span className="font-bold text-blue-500 text-xl">G</span>} />
      <ProviderCard name="Slack" provider="slack" icon={<span className="font-bold text-[#4A154B] dark:text-[#E01E5A] text-xl">#</span>} />
    </div>
  </div>
  );
};

/* --- API Keys Settings --- */
const APIKeysSettings = ({ darkMode }: any) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const { addToast } = useToast();

  const loadKeys = async () => { const data = await fetchApiKeys(); if (data) setKeys(data); };
  useEffect(() => { loadKeys(); }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    const res = await createApiKey(newKeyName);
    addToast("Key Created" + ": " + `Copy your token: ${res.token_full}`);
    setNewKeyName("");
    loadKeys();
  };

  const handleRevoke = async(id: string) => {
    await revokeApiKey(id);
    loadKeys();
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">API Keys</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage tokens for programmatic access.</p>
        </div>
        <div className="flex gap-2">
          <input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="Key Name" className={`px-3 py-1.5 text-sm rounded border ${darkMode?"bg-white/5 border-white/10":"bg-white border-slate-300"}`} />
          <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? "border-white/10" : "border-slate-200"}`}>
        <div className={`p-4 border-b text-sm font-medium flex ${darkMode ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
          <div className="w-1/3">Name</div>
          <div className="w-1/3">Token</div>
          <div className="w-1/3 text-right">Actions</div>
        </div>
        {keys.map(k => (
        <div key={k.id} className={`p-4 flex items-center text-sm border-b last:border-0 ${darkMode ? "bg-transparent text-slate-300 border-white/5" : "bg-white text-slate-700 border-slate-100"}`}>
          <div className="w-1/3 font-medium">{k.name}</div>
          <div className="w-1/3 font-mono text-xs">{k.token_prefix}</div>
          <div className="w-1/3 text-right">
            <button onClick={()=>handleRevoke(k.id)} className="text-red-400 hover:text-red-300">Revoke</button>
          </div>
        </div>
        ))}
        {keys.length===0 && <div className="p-4 text-center text-sm opacity-50">No API keys found.</div>}
      </div>
    </div>
  );
};

/* --- Notifications Settings --- */
const NotificationSettings = ({ darkMode, prefs, setPrefs }: any) => {
  const toggle = (key: string) => {
    setPrefs({ ...prefs, notifications: { ...prefs.notifications, [key]: !prefs.notifications[key] }});
  };
  return (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">Notifications</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Choose what updates you want to receive.</p>
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-2">Alerts</h3>
      <ToggleSwitch label="Pipeline Failures" checked={prefs.notifications?.pipeline_failures} onChange={()=>toggle('pipeline_failures')} darkMode={darkMode} />
      <div className={`h-px w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`}></div>
      <ToggleSwitch label="Security Threats" checked={prefs.notifications?.security_threats} onChange={()=>toggle('security_threats')} darkMode={darkMode} />
    </div>
  </div>
  );
};

/* --- Appearance Settings --- */
const AppearanceSettings = ({ darkMode, setDarkMode, prefs, setPrefs }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">Appearance</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Customize how the platform looks and feels.</p>
    </div>
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">Theme Preference</h3>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <button onClick={() => setDarkMode(false)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${!darkMode ? "border-indigo-500 bg-indigo-500/5 text-indigo-500" : "border-transparent bg-white/5 text-slate-400 hover:bg-white/10"}`}>
          <Sun className="w-8 h-8" />
          <span className="font-medium text-sm">Light Mode</span>
        </button>
        <button onClick={() => setDarkMode(true)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${darkMode ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
          <Moon className="w-8 h-8" />
          <span className="font-medium text-sm">Dark Mode</span>
        </button>
      </div>
    </div>
    <div className="space-y-4 pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">UI Density</h3>
      <select value={prefs.ui_density} onChange={(e)=>setPrefs({...prefs, ui_density: e.target.value})} className={`w-full max-w-xs px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none ${darkMode ? "bg-black/50 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
        <option>Compact (More data)</option>
        <option>Comfortable (Default)</option>
        <option>Spacious (Larger targets)</option>
      </select>
    </div>
  </div>
);

/* --- System Settings --- */
const SystemSettings = ({ darkMode, prefs, setPrefs }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold mb-1">System Preferences</h2>
      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Advanced configuration and destructive actions.</p>
    </div>
    <div className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Default AI Agent Model</label>
        <select value={prefs.default_ai_model} onChange={(e)=>setPrefs({...prefs, default_ai_model: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none ${darkMode ? "bg-black/50 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
          <option>Gemini 1.5 Pro (Recommended)</option>
          <option>Gemini 1.5 Flash (Faster)</option>
          <option>Claude 3.5 Sonnet</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Log Retention Period</label>
        <select value={prefs.log_retention} onChange={(e)=>setPrefs({...prefs, log_retention: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none ${darkMode ? "bg-black/50 border-white/10 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
          <option>7 Days</option>
          <option>30 Days</option>
          <option>90 Days</option>
          <option>Indefinite (Higher Cost)</option>
        </select>
      </div>
    </div>
  </div>
);
