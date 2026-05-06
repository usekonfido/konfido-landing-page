type LogoProps = {
  size?: number;
  variant?: 'color' | 'mono-light';
  className?: string;
};

export function Logo({ size = 30, variant = 'color', className }: LogoProps) {
  const fills =
    variant === 'mono-light'
      ? ['#4A5568', '#A0AEC0', '#FFFFFF']
      : ['#A8B8EE', '#3B82F6', '#1041DB'];
  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Konfido symbol"
      className={className}
    >
      <ellipse cx="22" cy="32" rx="16" ry="6" fill={fills[0]} />
      <ellipse cx="22" cy="24" rx="16" ry="6" fill={fills[1]} />
      <ellipse cx="22" cy="16" rx="16" ry="6" fill={fills[2]} />
    </svg>
  );
}
