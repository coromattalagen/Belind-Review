export function BelindLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <img
      src="/assets/belind-logo.webp"
      alt=""
      width={96}
      height={96}
      decoding="async"
      className={`rounded-full ring-1 ring-black/10 bg-white object-cover ${className}`}
    />
  );
}
