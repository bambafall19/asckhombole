import Image from "next/image";
import { SoccerBallIcon } from "./icons/soccer-ball-icon";

interface LogoProps {
  logoUrl?: string;
  className?: string;
}

export function Logo({ logoUrl, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
       <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
        {logoUrl ? (
            <Image src={logoUrl} alt="Logo ASC Khombole" width={28} height={28} className="object-contain" />
        ) : (
            <SoccerBallIcon className="text-accent-foreground h-6 w-6" />
        )}
      </div>
      <span className="font-bold text-xl text-foreground font-headline">
        ASC Khombole
      </span>
    </div>
  );
}
