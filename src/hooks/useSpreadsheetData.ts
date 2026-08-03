import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";

// Type definition for the spreadsheet row based on the known columns
export interface SpreadsheetRow {
  "Lead Name": string;
  "Phone Number": string;
  Email: string;
  "Date Captured": string;
  "UTM Campaign": string;
  "UTM Source": string;
  "UTM Content": string;
  "UTM Medium": string;
  "Lead Score": string;
  "Lead Grade": string;
  "Q1. Age": string;
  "Q2. Day-to-day": string;
  "Q3. Current profession": string;
  "Q4. Monthly income (before tax)": string;
  "Q5. Spent on courses/coaching": string;
  "Q6. How long trying to make money online": string;
  "Q7. Where are you with making money online": string;
  "Q8. What do you want most": string;
  "Q9. What frustrates you most": string;
  "Q10. How long following Abu Lahya": string;
  "Q11. Have you tried online business before": string;
  "Q12. What needs to happen for masterclass to be worth your time": string;
  "Q13. If you had 30 min 1-on-1 with Abu Lahya, what would you ask": string;
  "Capital available in next 30 days": string;
  Close_In_CRM: string;
  Close_Lead_Status: string;
  Close_Opportunity_Stage: string;
  Close_Pipeline: string;
  Close_Booked_Call: string;
  Close_Closed: string;
  Cash_Collected_USD: string;
  Payment_Type: string;
  Program_Type: string;
  Close_Date_Created: string;
  Pre_Webinar_Lead: string;
}

export function useSpreadsheetData() {
  return useQuery({
    queryKey: ["spreadsheetData"],
    queryFn: async (): Promise<SpreadsheetRow[]> => {
      const url = import.meta.env["VITE_SPREADSHEET_DATA"];

      if (!url) {
        throw new Error("Spreadsheet URL is not defined in environment variables");
      }

      // Convert view/edit URL to export URL for CSV
      let exportUrl = url;
      if (url.includes("/edit")) {
        exportUrl = url.replace(/\/edit\?.*gid=([0-9]+).*/, "/export?format=csv&gid=$1");
      }

      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch spreadsheet data");
      }

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data as SpreadsheetRow[]);
          },
          error: (parseError: Error) => {
            reject(parseError);
          },
        });
      });
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
