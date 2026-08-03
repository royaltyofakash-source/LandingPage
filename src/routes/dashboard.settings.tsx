import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/landing/Reveal";
import { Settings, User, Bell, Shield, PaintBucket } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings - Transformation Hub" }],
  }),
});

function SettingsPage() {
  return (
    <>
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

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Settings Navigation */}
        <Reveal delay={200} className="lg:col-span-1">
          <nav className="flex flex-col gap-2">
            {[
              { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" />, active: true },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
              { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
              { id: 'appearance', label: 'Appearance', icon: <PaintBucket className="h-4 w-4" /> },
            ].map(item => (
              <button 
                key={item.id}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </Reveal>

        {/* Settings Form Content */}
        <Reveal delay={300} className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-sm p-6 sm:p-8">
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">Profile Information</h3>
            
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-primary-foreground flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  MT
                </div>
                <div className="space-y-2">
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                    Upload new photo
                  </button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <input type="text" defaultValue="Maria" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <input type="text" defaultValue="Toscano" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input type="email" defaultValue="maria.toscano@example.com" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Bio</label>
                  <textarea rows={4} defaultValue="Creator of the remote email skill masterclass. Helping thousands achieve financial independence." className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-8">
                <button className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
