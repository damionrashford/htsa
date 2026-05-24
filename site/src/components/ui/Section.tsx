interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function Section({ children, id, className = "" }: SectionProps) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
}
