/**
 * A tiny stepped-triangle pixel mountain — stacked bars of shrinking width
 * instead of a smooth path, so it reads as pixel art like the rest of the
 * mascot/headline system. Used as a sparse decorative accent.
 */
export function PixelMountain({
  size = 22,
  color = "#7A3D10",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const rows = [2, 4, 6, 8, 10];
  const rowHeight = 1.2;

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 10 6"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.map((w, i) => (
        <rect
          key={i}
          x={(10 - w) / 2}
          y={i * rowHeight}
          width={w}
          height={rowHeight}
          fill={color}
        />
      ))}
    </svg>
  );
}
