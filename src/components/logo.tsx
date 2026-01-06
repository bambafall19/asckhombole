import Image from "next/image";
import { SoccerBallIcon } from "./icons/soccer-ball-icon";

interface LogoProps {
  logoUrl?: string;
  className?: string;
}

export function Logo({ logoUrl, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoUrl ? (
          <Image src={logoUrl} alt="Logo ASC Khombole" width={36} height={36} className="object-contain" />
      ) : (
          <SoccerBallIcon />
      )}
      <span className="font-bold text-xl text-foreground font-headline">
        ASC Khombole
      </span>
    </div>
  );
}
