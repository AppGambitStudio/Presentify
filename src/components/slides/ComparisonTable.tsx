interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--slide-card-border)", background: "var(--slide-card-bg)" }}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr style={{ background: "var(--slide-card-bg)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="p-5 font-bold uppercase tracking-wider text-base"
                style={{
                  fontFamily: "var(--slide-font-heading)",
                  color: i === headers.length - 1 ? "var(--slide-primary)" : "var(--slide-text-muted)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderTop: "1px solid var(--slide-card-border)" }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="p-5 text-lg"
                  style={{
                    color: j === row.length - 1 ? "var(--slide-primary)" : "var(--slide-text-muted)",
                    fontWeight: j === row.length - 1 ? 700 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
