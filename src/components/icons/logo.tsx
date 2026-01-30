import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Plus size={20} />
      </div>
      <span className="font-headline text-2xl font-bold tracking-tight">
        SwasthyaSetu
      </span>
    </div>
  );
};

export default Logo;
