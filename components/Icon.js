const icons = {
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  diamond: (
    <>
      <path d="M12 3 20 9 12 21 4 9Z" />
      <path d="M4 9h16" />
      <path d="M9.6 9 12 21" />
      <path d="M14.4 9 12 21" />
    </>
  ),
  pen: (
    <>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      <path d="M14.5 5.5l3 3" />
    </>
  ),
  chart: (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
  funnel: (
    <>
      <path d="M3 5h18l-7 8v6l-4 2v-8z" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.1A8.5 8.5 0 1 1 21 11.5z" />
    </>
  ),
  bolt: (
    <>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  megaphone: (
    <>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </>
  ),
  star: (
    <polygon
      points="12 2 14.6 8.6 21.5 9.2 16.2 13.8 17.8 20.5 12 16.9 6.2 20.5 7.8 13.8 2.5 9.2 9.4 8.6"
      fill="currentColor"
      stroke="none"
    />
  )
};

export default function Icon({ name, size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name] || icons.target}
    </svg>
  );
}
