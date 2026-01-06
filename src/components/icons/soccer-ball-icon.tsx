import { cn } from "@/lib/utils";

export function SoccerBallIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-8 text-primary", className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m16.23 7.77-1.15 4.23-4.23 1.15-4.23-1.15 1.15-4.23 4.23-1.15Z" />
      <path d="M12 2v3.31" />
      <path d="M16.23 7.77 22 12" />
      <path d="M12 22v-3.31" />
      <path d="m7.77 16.23-4.23-1.15" />
      <path d="M7.77 7.77 2 12" />
      <path d="m16.23 16.23 4.23 1.15" />
    </svg>
  );
}
