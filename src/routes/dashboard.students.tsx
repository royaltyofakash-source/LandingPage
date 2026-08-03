import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/landing/Reveal";
import { Users, Search, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/dashboard/students")({
  component: StudentsPage,
  head: () => ({
    meta: [{ title: "Students - Transformation Hub" }],
  }),
});

function StudentsPage() {
  const students = [
    { id: "STU-1029", name: "Ahmed Khan", email: "ahmed.k@example.com", date: "Aug 02, 2026", status: "Active", progress: "85%" },
    { id: "STU-1028", name: "Sara Jenkins", email: "sara.j@example.com", date: "Aug 01, 2026", status: "Active", progress: "42%" },
    { id: "STU-1027", name: "Omar Farooq", email: "omar.f@example.com", date: "Jul 30, 2026", status: "Completed", progress: "100%" },
    { id: "STU-1026", name: "David Chen", email: "david.c@example.com", date: "Jul 28, 2026", status: "Active", progress: "15%" },
    { id: "STU-1025", name: "Zainab Ali", email: "zainab.a@example.com", date: "Jul 25, 2026", status: "Inactive", progress: "5%" },
    { id: "STU-1024", name: "Michael Ross", email: "m.ross@example.com", date: "Jul 20, 2026", status: "Active", progress: "60%" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Reveal delay={0}>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Student Directory
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-muted-foreground">
              Manage your masterclass attendees and monitor progress.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={300}>
        <div className="rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-accent/30 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Enrolled</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {students.map((student, i) => (
                  <tr key={student.id} className="hover:bg-accent/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{student.name}</div>
                          <div className="text-muted-foreground text-xs">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                        student.status === 'Completed' ? 'bg-primary/10 text-primary' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden w-20">
                          <div className="h-full bg-primary rounded-full" style={{ width: student.progress }}></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{student.progress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </>
  );
}
