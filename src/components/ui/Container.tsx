interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export default function Container({ children, className = "", size = "default" }: ContainerProps) {
  const maxWidth = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1920px]",
  };

  return (
    <div className={`container mx-auto px-6 ${maxWidth[size]} ${className}`}>
      {children}
    </div>
  );
}
