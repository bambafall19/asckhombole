import Image from "next/image";
import { SoccerBallIcon } from "./icons/soccer-ball-icon";
import { cn } from "@/lib/utils";

interface LogoProps {
  logoUrl?: string;
  className?: string;
}

export function Logo({ logoUrl, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {logoUrl ? (
          <Image src={logoUrl} alt="Logo ASC Khombole" width={40} height={40} className="object-contain" />
      ) : (
          <SoccerBallIcon className="h-10 w-10 text-primary" />
      )}
      <span className="font-bold text-2xl text-foreground font-headline">
        Asc Khombole
      </span>
    </div>
  );
}
