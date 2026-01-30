import { cn } from "@/lib/utils";
import Image from 'next/image';

const Logo = ({ className }: { className?: string }) => {
  const logoUrl = "https://storage.googleapis.com/generative-ai-assets/swasthyasetu-logo.png";
  return (
    <div className={cn("flex items-center", className)}>
      <Image src={logoUrl} alt="SwasthyaSetu Logo" width={240} height={54} priority />
    </div>
  );
};

export default Logo;
