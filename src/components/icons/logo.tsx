import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2.66663C8.63636 2.66663 2.66667 8.63632 2.66667 16C2.66667 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3333 23.3636 29.3333 16C29.3333 8.63632 23.3637 2.66663 16 2.66663Z" fill="hsl(var(--primary))"/>
            <path d="M17.3333 14.6667V8H14.6667V14.6667H8V17.3334H14.6667V24H17.3333V17.3334H24V14.6667H17.3333Z" fill="hsl(var(--primary-foreground))"/>
        </svg>
      <div className="flex flex-col">
        <h1 className="font-headline text-xl font-bold leading-tight">
          SwasthyaSetu
        </h1>
        <p className="text-xs text-muted-foreground leading-tight">Ek Jeevan. Ek Swasthya Drishti.</p>
      </div>
    </div>
  );
};

export default Logo;
