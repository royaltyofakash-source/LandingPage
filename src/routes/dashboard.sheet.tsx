import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/landing/Reveal";
import { Table2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/sheet")({
  component: SheetPage,
  head: () => ({
    meta: [{ title: "Spreadsheet Data - Transformation Hub" }],
  }),
});

function SheetPage() {
  const { data, isLoading, error } = useSpreadsheetData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  
  const filteredData = data?.filter((row) => {
    if (!searchTerm) return true;
    return columns.some((col) => 
      String(row[col as keyof typeof row]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle search change (reset to page 1)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden bg-background">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-border gap-4 shrink-0">
        <div className="space-y-1">
          <Reveal delay={0}>
            <h2 className="text-xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
              <Table2 className="h-6 w-6 text-primary" />
              Spreadsheet Data
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-sm text-muted-foreground">
              View all captured lead information exactly as it appears in your Google Sheet.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <input
            type="text"
            placeholder="Search data..."
            className="px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-full sm:w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Reveal>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-hidden bg-card flex flex-col relative w-full">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            Loading spreadsheet data...
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-destructive bg-destructive/5">
            <p className="font-medium text-lg">Error loading data</p>
            <p className="text-sm opacity-80 mt-2">{(error as Error).message}</p>
          </div>
        ) : data && data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
            No data found in the spreadsheet.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto w-full">
              <table className="w-full h-full text-sm sm:text-base text-left border-collapse">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/80 whitespace-nowrap sticky top-0 z-30 shadow-sm backdrop-blur-sm h-12">
                  <tr>
                    <th className="px-6 py-4 font-semibold sticky left-0 z-40 bg-muted/90 shadow-[1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)]">
                      #
                    </th>
                    {columns.map((column, index) => (
                      <th key={index} className="px-6 py-4 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.map((row, index) => {
                    const absoluteIndex = startIndex + index + 1;
                    return (
                      <tr key={absoluteIndex} className="hover:bg-accent/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground sticky left-0 z-10 bg-card/90 backdrop-blur shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] font-medium">
                          {absoluteIndex}
                        </td>
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-foreground/90 max-w-[400px] truncate" title={String(row[column as keyof typeof row])}>
                            {row[column as keyof typeof row] || <span className="text-muted-foreground/30">-</span>}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-muted-foreground h-full">
                        No matching records found for "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="p-3 border-t border-border bg-muted/30 flex flex-wrap justify-between items-center gap-4 shrink-0">
              <div className="text-xs text-muted-foreground whitespace-nowrap flex-1">
                Showing <span className="font-medium text-foreground">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-foreground">{filteredData.length}</span> records
              </div>
              
              <div className="flex items-center justify-center gap-2 flex-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span className="min-w-[2rem] text-center bg-primary text-primary-foreground py-0.5 rounded shadow-sm text-xs">
                    {currentPage}
                  </span>
                  <span className="text-muted-foreground px-1 text-xs">of</span>
                  <span className="text-muted-foreground font-semibold text-xs">
                    {totalPages > 0 ? totalPages : 1}
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 flex justify-end">
                <a 
                  href={import.meta.env.VITE_SPREADSHEET_DATA} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  Open Original <Table2 className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
