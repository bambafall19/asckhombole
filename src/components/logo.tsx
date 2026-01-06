import { SoccerBallIcon } from "./icons/soccer-ball-icon";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
       <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
        <SoccerBallIcon className="text-accent-foreground h-6 w-6" />
      </div>
      <span className="font-bold text-xl text-foreground font-headline">
        ASC Khombole
      </span>
    </div>
  );
}
