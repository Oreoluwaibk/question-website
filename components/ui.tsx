type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-mint text-primary-text hover:opacity-90",
    secondary: "border border-border bg-card text-foreground hover:bg-border",
    danger: "bg-danger text-white hover:opacity-90",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-mint focus:ring-2 focus:ring-[var(--mint-soft)] ${className}`}
      {...props}
    />
  );
}
