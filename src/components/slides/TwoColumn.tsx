interface TwoColumnProps { left: React.ReactNode; right: React.ReactNode; }

export function TwoColumn({ left, right }: TwoColumnProps) {
  return (
    <div className="grid grid-cols-2 gap-8 items-start">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
