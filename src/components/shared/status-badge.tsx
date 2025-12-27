import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = 'Available' | 'Busy' | 'On a project' | 'Hiring' | 'Funding Open' | 'Accepting Partnerships';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles = {
    'Available': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    'Busy': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    'On a project': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
    'Hiring': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800',
    'Funding Open': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
    'Accepting Partnerships': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
  };

  return (
    <Badge
      className={cn("font-normal", statusStyles[status], className)}
      variant="outline"
    >
      {status}
    </Badge>
  );
}
