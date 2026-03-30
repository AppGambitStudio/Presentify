import type { Slide, Cell } from "@/lib/types";
import { componentRegistry } from "@/components/slides";

interface SlideRendererProps {
  slide: Slide;
}

function CellRenderer({ cell }: { cell: Cell }) {
  const Component = componentRegistry[cell.component];
  if (!Component) {
    console.warn(`Unknown component type: ${cell.component}`);
    return null;
  }
  return (
    <div data-cell-id={cell.id} style={{ gridArea: cell.gridArea }}>
      <Component {...cell.props} />
    </div>
  );
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  return (
    <div className="slide-content">
      <div
        data-slide-grid
        className="w-full h-full"
        style={{
          display: "grid",
          gridTemplateColumns: slide.layout.columns,
          gridTemplateRows: slide.layout.rows,
          gap: slide.layout.gap,
          alignContent: "center",
        }}
      >
        {slide.cells.map((cell) => (
          <CellRenderer key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  );
}
