export function Divider({ className = "" }) {
  return <div  className={`mt-3 h-0.5 bg-gradient-to-r from-red-500 via-blue-500 to-orange-400 ${className}`} />;
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3  font-semibold uppercase tracking-wide" >
      {children}
    </th>
  );
}
export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-3xl  ${className}`}>{children}</td>;
}

export function Field({ label, value, link = "" }) {
  return (
    <div className="grid grid-cols-[180px,1fr] items-center lg:text-3xl sm:text-[13px] whitespace-nowrap gap-20 ">
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
