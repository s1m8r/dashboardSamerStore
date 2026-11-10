import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  description: string;
}

export default function AuthBrandPanel({ title, description }: Props) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--sidebar-primary) 35%, transparent), transparent 55%), radial-gradient(circle at 85% 85%, color-mix(in oklch, var(--sidebar-primary) 22%, transparent), transparent 50%)",
        }}
      />
      <Link to="/" className="relative flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
          <img
            src="/logo.png"
            alt="logo"
            className="size-full object-contain"
          />
        </span>
        <span className="font-heading text-sm font-semibold tracking-tight">
          Dashboard Samer Store
        </span>
      </Link>
      <div className="relative max-w-sm">
        <p className="font-heading text-3xl leading-tight font-semibold">
          {title}
        </p>
        <p className="mt-3 text-sm text-sidebar-foreground/70">{description}</p>
      </div>
      <p className="relative text-xs text-sidebar-foreground/50">
        &copy; {new Date().getFullYear()} Dashboard Samer Store
      </p>
    </div>
  );
}
