export function Divider({ className = "" }) {
  return <div className={`mt-1 h-px bg-gray-200 ${className}`} />;
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
      {children}
    </th>
  );
}
export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}

export function Field({ label, value, link = "" }) {
  return (
    <div className="grid grid-cols-[160px,1fr] items-center text-sm sm:text-[13px]">
      <span className="text-gray-500">{label ? `${label}:` : ""}</span>
      {link ? (
        <a href="#" className="font-medium text-blue-700 hover:underline">
          {value}
        </a>
      ) : (
        <span className="font-medium text-gray-800">{value}</span>
      )}
    </div>
  );
}
