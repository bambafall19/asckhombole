import Image from "next/image";
import { SoccerBallIcon } from "./icons/soccer-ball-icon";
import { cn } from "@/lib/utils";

interface LogoProps {
  logoUrl?: string;
  className?: string;
}

export function Logo({ logoUrl, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {logoUrl ? (
          <Image src={logoUrl} alt="Logo ASC Khombole" width={32} height={32} className="object-contain" />
      ) : (
          <SoccerBallIcon className="h-8 w-8 text-primary" />
      )}
      <span className="font-bold text-lg text-foreground font-headline hidden sm:inline-block">
        Asc Khombole
      </span>
    </div>
  );
}
