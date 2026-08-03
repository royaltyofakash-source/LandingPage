import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/landing/Reveal";
import { Settings, User, Bell, Shield, PaintBucket, Database } from "lucide-react";
import { DataSourcePanel } from "@/components/dashboard/DataSourcePanel";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings - Transformation Hub" }],
  }),
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "data", label: "Data Source", icon: <Database className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <PaintBucket className="h-4 w-4" /> },
  ];

  return (
    <div className="flex w-full flex-1 flex-col p-6 sm:p-8">
      <div className="space-y-2 mb-8">
        <Reveal delay={0}>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Platform Settings
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-muted-foreground">
            Manage your account preferences and platform configurations.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-1 flex-col gap-8 md:flex-row">
        {/* Settings Navigation */}
        <Reveal delay={200} className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </Reveal>

        {/* Settings Content */}
        <Reveal delay={300} className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Profile Information</h3>

                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                      MT
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                        Upload new photo
                      </button>
                      <p className="text-xs text-muted-foreground">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        defaultValue="Maria"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        defaultValue="Toscano"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue="maria.toscano@example.com"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="bio" className="text-sm font-medium text-foreground">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        defaultValue="Creator of the remote email skill masterclass. Helping thousands achieve financial independence."
                        className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <button className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DataSourcePanel />
              </div>
            )}

            {activeTab !== "profile" && activeTab !== "data" && (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-muted-foreground animate-in fade-in duration-300">
                <Settings className="h-12 w-12 opacity-20 mb-4" />
                <p>This settings panel is under construction.</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
