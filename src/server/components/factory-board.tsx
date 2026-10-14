// The "what a software factory is" diagram: cards leave a task board, pass
// through three agent sandboxes, and come out as pull requests that merge. The
// task board and the PR stack carry the same still frame the client animation
// starts from — see `src/client/pages/software-factory.ts`.

export function FactoryBoard() {
  return (
    <svg
      id="scene2"
      viewBox="0 0 960 400"
      role="img"
      aria-label="Cards leave a task board, pass through three sandboxes, and come out as pull requests."
    >
      <defs>
        <g id="card1">
          <rect
            x="0"
            y="0"
            width="56"
            height="30"
            fill="var(--paper)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="6" y="7" width="30" height="4" fill="var(--roller)" />
          <rect x="6" y="16" width="20" height="4" fill="var(--lilac)" />
          <rect x="44" y="7" width="6" height="6" fill="var(--salmon)" />
        </g>
        <g id="pr1">
          <rect
            x="0"
            y="0"
            width="64"
            height="30"
            fill="var(--paper)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="6" y="6" width="4" height="18" fill="var(--ok)" />
          <rect x="6" y="6" width="10" height="4" fill="var(--ok)" />
          <rect x="12" y="6" width="4" height="10" fill="var(--ok)" />
          <rect x="12" y="20" width="4" height="4" fill="var(--ok)" />
          <rect x="24" y="8" width="30" height="4" fill="var(--roller)" />
          <rect x="24" y="17" width="20" height="4" fill="var(--lilac)" />
        </g>
        <g id="box">
          <rect x="0" y="0" width="150" height="80" fill="var(--lilac-2)" />
          <rect x="0" y="0" width="138" height="80" fill="var(--lilac)" />
          <rect x="0" y="0" width="150" height="8" fill="var(--lilac-3)" />
          <rect x="0" y="0" width="12" height="12" fill="var(--salmon)" />
          <rect x="138" y="0" width="12" height="12" fill="var(--salmon)" />
          <rect x="0" y="68" width="12" height="12" fill="var(--salmon)" />
          <rect x="138" y="68" width="12" height="12" fill="var(--salmon)" />
          <rect x="18" y="20" width="26" height="12" fill="var(--roller)" />
          <g className="eyes">
            <rect x="22" y="23" width="6" height="6" fill="var(--eye)" />
            <rect x="34" y="23" width="6" height="6" fill="var(--eye)" />
          </g>
          <rect x="54" y="16" width="74" height="52" fill="var(--roller)" />
          <g className="work" fill="var(--ok)">
            <rect x="60" y="22" width="40" height="4" />
            <rect x="60" y="30" width="28" height="4" />
            <rect x="60" y="38" width="50" height="4" />
            <rect x="60" y="46" width="34" height="4" />
            <rect x="60" y="54" width="44" height="4" />
          </g>
          <rect
            className="cursor"
            x="104"
            y="54"
            width="6"
            height="4"
            fill="var(--eye)"
          />
        </g>
        <clipPath id="clip-board">
          <rect x="0" y="30" width="230" height="300" />
        </clipPath>
      </defs>

      {/* board */}
      <g transform="translate(20 30)">
        <rect
          x="0"
          y="0"
          width="230"
          height="330"
          fill="var(--bg-2)"
          stroke="var(--roller)"
          stroke-width="3"
        />
        <rect x="0" y="0" width="230" height="30" fill="var(--roller)" />
        <text className="lbl big" x="12" y="22" style={{ fill: "#fff" }}>
          TASK BOARD
        </text>
        <text className="lbl" x="18" y="56">
          TO DO
        </text>
        <text className="lbl" x="130" y="56">
          DOING
        </text>
        <line
          x1="115"
          y1="40"
          x2="115"
          y2="320"
          stroke="var(--line)"
          stroke-width="3"
        />
        <g clip-path="url(#clip-board)">
          <g id="todo">
            {/* still frame: the to-do column */}
            <use href="#card1" x="10" y="70" />
            <use href="#card1" x="10" y="110" />
            <use href="#card1" x="10" y="150" />
            <use href="#card1" x="10" y="190" />
            <use href="#card1" x="10" y="230" />
            <use href="#card1" x="10" y="270" />
          </g>
        </g>
        <g id="doing" />
      </g>

      {/* sandboxes */}
      <g id="boxes">
        <g transform="translate(400 40)">
          <use href="#box" />
        </g>
        <g transform="translate(400 160)">
          <use href="#box" />
        </g>
        <g transform="translate(400 280)">
          <use href="#box" />
        </g>
        <text className="lbl strong" x="475" y="30" text-anchor="middle">
          AGENTS IN SANDBOXES
        </text>
      </g>

      {/* wires */}
      <g
        stroke="var(--belt-2)"
        stroke-width="4"
        fill="none"
        stroke-dasharray="8 6"
        className="wires"
      >
        <path d="M250 110 H330 V80 H400" />
        <path d="M250 200 H400" />
        <path d="M250 290 H330 V320 H400" />
        <path d="M550 80 H640 V140 H720" />
        <path d="M550 200 H640 V160 H720" />
        <path d="M550 320 H640 V180 H720" />
      </g>

      {/* PR stack */}
      <g transform="translate(720 30)">
        <rect
          x="0"
          y="0"
          width="220"
          height="330"
          fill="var(--bg-2)"
          stroke="var(--roller)"
          stroke-width="3"
        />
        <rect x="0" y="0" width="220" height="30" fill="var(--roller)" />
        <text className="lbl big" x="12" y="22" style={{ fill: "#fff" }}>
          PULL REQUESTS
        </text>
        <g id="prs">
          {/* still frame: two open pull requests */}
          <g transform="translate(12 44)">
            <use href="#pr1" />
          </g>
          <g transform="translate(12 84)">
            <use href="#pr1" />
          </g>
        </g>
        <g id="merged" transform="translate(12 300)">
          <text className="lbl" x="0" y="14">
            MERGED{" "}
            <tspan id="mcount" className="strong">
              0
            </tspan>
          </text>
        </g>
      </g>
      <g id="flying1" />
    </svg>
  );
}
