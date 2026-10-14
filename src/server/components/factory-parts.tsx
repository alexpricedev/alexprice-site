// A single item placed on an SVG belt: a grouped <use> of one of the shapes
// defined in `<defs>`. Used for the server-rendered still frame that shows
// before (or instead of) the client animation.

interface StaticItemProps {
  /** The id of a `<g>` in `<defs>` — ticket, repo, context, plan, cube, … */
  id: string;
  x: number;
  y: number;
}

export function StaticItem({ id, x, y }: StaticItemProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <use href={`#${id}`} />
    </g>
  );
}
