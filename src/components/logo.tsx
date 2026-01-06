import { SoccerBallIcon } from "./icons/soccer-ball-icon";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 120, height = 40, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SoccerBallIcon className="text-primary h-8 w-8" />
      <span className="font-bold text-xl text-foreground font-headline">
        ASC Khombole
      </span>
    </div>
  );
}
