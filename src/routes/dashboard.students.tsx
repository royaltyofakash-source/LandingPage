import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/landing/Reveal";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData";
import { formatCurrency, isoDate, parseAmount } from "@/lib/dashboard-metrics";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/students")({
  component: StudentsPage,
  head: () => ({
    meta: [{ title: "Students - Transformation Hub" }],
  }),
});

const GRADE_STYLES: Record<string, string> = {
  A: "bg-emerald-500/10 text-emerald-600",
  B: "bg-primary/10 text-primary",
  C: "bg-amber-500/10 text-amber-600",
  D: "bg-muted text-muted-foreground",
};

function StudentsPage() {
  const { data, isPending: isLoading, error } = useSpreadsheetData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Every column below comes straight from the sheet — nothing is synthesised.
  const students = (data ?? []).map((row) => {
    const score = parseFloat((row["Lead Score"] ?? "").trim());
    const cash = parseAmount(row["Cash_Collected_USD"]);

    return {
      name: row["Lead Name"]?.trim() || "Unnamed lead",
      email: row["Email"]?.trim() || "—",
      phone: row["Phone Number"]?.trim() || "",
      captured: isoDate(row["Date Captured"]) ?? "—",
      grade: (row["Lead Grade"] ?? "").trim().toUpperCase(),
      score: Number.isFinite(score) ? score : null,
      bookedCall: (row["Close_Booked_Call"] ?? "").trim().toLowerCase() === "yes",
      closed: (row["Close_Closed"] ?? "").trim().toLowerCase() === "yes",
      stage: (row["Close_Opportunity_Stage"] ?? "").trim(),
      status: (row["Close_Lead_Status"] ?? "").trim(),
      cash,
    };
  });

  const query = searchTerm.trim().toLowerCase();
  const filteredStudents = query
    ? students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.phone.toLowerCase().includes(query),
      )
    : students;

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex w-full flex-1 flex-col p-4 sm:p-6 lg:p-8">
      {/* Header Area */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Reveal delay={0}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground sm:gap-3 sm:text-3xl">
              <Users className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" />
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 w-full rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </Reveal>
      </div>

      {/* Table Area */}
      <div className="relative flex w-full min-h-100 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-sm">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            Loading student data...
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-destructive bg-destructive/5">
            <p className="font-medium text-lg">Error loading data</p>
            <p className="text-sm opacity-80 mt-2">{(error as Error).message}</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
            No students found.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto w-full">
              <table className="w-full min-w-215 border-collapse text-left text-sm">
                <thead className="text-xs font-semibold text-muted-foreground uppercase bg-muted/80 whitespace-nowrap sticky top-0 z-30 shadow-sm backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-4 sm:px-6">Student</th>
                    <th className="px-4 py-4 sm:px-6">Captured</th>
                    <th className="px-4 py-4 sm:px-6">Grade</th>
                    <th className="px-4 py-4 sm:px-6">Lead Score</th>
                    <th className="px-4 py-4 sm:px-6">CRM Stage</th>
                    <th className="px-4 py-4 text-right sm:px-6">Cash Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedStudents.map((student, i) => (
                    <tr
                      key={`${student.email}-${startIndex + i}`}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {student.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {student.name}
                            </div>
                            <div className="text-muted-foreground text-xs truncate">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted-foreground sm:px-6">
                        {student.captured}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        {student.grade ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              GRADE_STYLES[student.grade] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {student.grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        {student.score === null ? (
                          <span className="text-muted-foreground/40">Not scored</span>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${Math.min(100, Math.max(0, student.score * 10))}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground min-w-10">
                              {student.score.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        {student.closed ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                            Closed
                          </span>
                        ) : student.bookedCall ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Call booked
                          </span>
                        ) : student.stage || student.status ? (
                          <span
                            className="text-xs text-muted-foreground truncate block max-w-45"
                            title={student.stage || student.status}
                          >
                            {student.stage || student.status}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">Not in CRM</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                        {student.cash > 0 ? (
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(student.cash, 2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {paginatedStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No students found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-border bg-muted/30 p-3 sm:flex-row sm:gap-4">
              <div className="whitespace-nowrap text-center text-xs text-muted-foreground sm:flex-1 sm:text-left">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredStudents.length > 0 ? startIndex + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(startIndex + itemsPerPage, filteredStudents.length)}
                </span>{" "}
                of <span className="font-medium text-foreground">{filteredStudents.length}</span>{" "}
                students
              </div>

              <div className="flex items-center justify-center gap-2 sm:flex-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 text-sm font-medium">
                  <span className="min-w-8 text-center bg-primary text-primary-foreground py-0.5 rounded shadow-sm text-xs">
                    {currentPage}
                  </span>
                  <span className="text-muted-foreground px-1 text-xs">of</span>
                  <span className="text-muted-foreground font-semibold text-xs">
                    {totalPages > 0 ? totalPages : 1}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-end sm:flex-1" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
