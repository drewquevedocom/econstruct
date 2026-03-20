import Link from "next/link";

interface ButtonProps {
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  size?: "default" | "lg";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ href, variant = "primary", size = "default", children, className = "", type = "button", disabled, onClick }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-full";
  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    primary: "bg-accent-gold text-white hover:bg-white hover:text-brand-dark shadow-md",
    secondary: "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white",
    dark: "bg-brand-dark text-white hover:bg-black",
    ghost: "border border-white/30 text-white hover:bg-white/10",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }
  return <button type={type} disabled={disabled} onClick={onClick} className={classes}>{children}</button>;
}
