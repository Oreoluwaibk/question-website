import Image from "next/image";

type AppLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function AppLogo({
  size = 36,
  className = "",
  priority = false,
}: AppLogoProps) {
  return (
    <Image
      src="/icon.png"
      alt="Question Bank"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-xl ${className}`}
    />
  );
}
