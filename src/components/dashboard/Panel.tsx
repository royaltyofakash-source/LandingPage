import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}

export function StatCard({
  title,
  value,
  hint,
  icon,
  isLoading,
}: {
  title: string;
  value: string;
  hint: string;
  icon: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium tracking-tight text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div>
        {isLoading ? (
          <>
            <div className="h-8 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted/60" />
          </>
        ) : (
          <>
            <div className="font-display text-2xl font-bold text-foreground">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

export function PanelEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function DataError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
      <p className="font-medium">Could not load spreadsheet data</p>
      <p className="mt-1 text-sm opacity-80">{message}</p>
    </div>
  );
}
