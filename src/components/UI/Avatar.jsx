/**
 * Get 2-letter initials from a name
 */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Circular avatar - 32x32, dark purple #330033, white initials
 * @param {{ name: string }} props
 */
export function Avatar({ name }) {
  const initials = getInitials(name);

  return (
    <div
      className="w-8 h-8 rounded-full bg-avatar flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0"
      title={name}
    >
      {initials}
    </div>
  );
}
