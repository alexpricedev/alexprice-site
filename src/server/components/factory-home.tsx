// The hero automation: tickets, code and context ride three belts into a
// planner, then a plan moves on to the builder, the reviewer, and out as merged
// work. Every element the client animation reaches for (`.stripe`, `#planner`,
// `#builder`, `#reviewer`, `#items`, …) is named here — see
// `src/client/pages/home.ts` for the choreography.
//
// The items inside `#items` are the reduced-motion / no-JavaScript still frame.
// The client clears that group before it starts animating.

import { StaticItem } from "./factory-parts";

export function FactoryHome() {
  return (
    <svg
      viewBox="0 -24 960 468"
      role="img"
      aria-labelledby="factory-title factory-desc"
      id="scene"
    >
      <title id="factory-title">The software factory</title>
      <desc id="factory-desc">
        Tickets, repo and context travel along belts into a planner. Plans move
        on to a builder, then a reviewer. Approved work leaves as merged pull
        requests; rejected work loops back to the builder.
      </desc>
      <defs>
        <g id="ticket">
          <rect
            x="0"
            y="0"
            width="28"
            height="24"
            fill="var(--paper)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="4" y="5" width="6" height="6" fill="var(--salmon)" />
          <rect x="13" y="6" width="11" height="3" fill="var(--roller)" />
          <rect x="4" y="14" width="6" height="6" fill="var(--ok)" />
          <rect x="13" y="15" width="8" height="3" fill="var(--roller)" />
        </g>
        <g id="repo">
          <rect
            x="0"
            y="0"
            width="28"
            height="24"
            fill="var(--code)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="5" y="8" width="3" height="3" fill="#fff" />
          <rect x="8" y="11" width="3" height="3" fill="#fff" />
          <rect x="5" y="14" width="3" height="3" fill="#fff" />
          <rect
            x="13"
            y="7"
            width="3"
            height="11"
            fill="#fff"
            transform="skewX(-14) translate(3 0)"
          />
          <rect x="20" y="8" width="3" height="3" fill="#fff" />
          <rect x="17" y="11" width="3" height="3" fill="#fff" />
          <rect x="20" y="14" width="3" height="3" fill="#fff" />
        </g>
        <g id="context">
          <rect
            x="0"
            y="0"
            width="28"
            height="24"
            fill="var(--paper)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="5" y="6" width="18" height="3" fill="var(--lilac)" />
          <rect x="5" y="11" width="14" height="3" fill="var(--lilac)" />
          <rect x="5" y="16" width="16" height="3" fill="var(--lilac)" />
        </g>
        <g id="plan">
          <rect
            x="0"
            y="0"
            width="28"
            height="24"
            fill="var(--paper)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="5" y="5" width="18" height="3" fill="var(--roller)" />
          <rect x="5" y="10" width="4" height="4" fill="var(--ok)" />
          <rect x="11" y="11" width="12" height="2" fill="var(--lilac)" />
          <rect x="5" y="16" width="4" height="4" fill="var(--ok)" />
          <rect x="11" y="17" width="9" height="2" fill="var(--lilac)" />
        </g>
        <g id="cube">
          <rect
            x="0"
            y="6"
            width="22"
            height="22"
            fill="var(--ice)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <polygon
            points="0,6 8,0 30,0 22,6"
            fill="#E4F0FA"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <polygon
            points="22,6 30,0 30,22 22,28"
            fill="var(--ice-2)"
            stroke="var(--roller)"
            stroke-width="2"
          />
        </g>
        <g id="cube-ok">
          <use href="#cube" />
          <rect x="6" y="14" width="3" height="3" fill="var(--ok)" />
          <rect x="9" y="17" width="3" height="3" fill="var(--ok)" />
          <rect x="12" y="14" width="3" height="3" fill="var(--ok)" />
          <rect x="15" y="11" width="3" height="3" fill="var(--ok)" />
        </g>
        <g id="cube-fix">
          <use href="#cube" />
          <rect x="6" y="11" width="3" height="3" fill="var(--warn)" />
          <rect x="9" y="14" width="3" height="3" fill="var(--warn)" />
          <rect x="12" y="17" width="3" height="3" fill="var(--warn)" />
          <rect x="12" y="11" width="3" height="3" fill="var(--warn)" />
          <rect x="6" y="17" width="3" height="3" fill="var(--warn)" />
        </g>
        <g id="blk">
          <rect
            x="0"
            y="0"
            width="16"
            height="16"
            fill="var(--ice)"
            stroke="var(--roller)"
            stroke-width="2"
          />
          <rect x="3" y="3" width="4" height="4" fill="#E4F0FA" />
        </g>
        {/* a belt segment: top strip, stripe, rollers */}
        <pattern
          id="stripe"
          width="16"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="var(--belt-2)" />
        </pattern>
        <pattern
          id="stripe-v"
          width="8"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="var(--belt-2)" />
        </pattern>
        <clipPath id="clip-scene">
          <rect x="0" y="-24" width="960" height="468" />
        </clipPath>
      </defs>

      <g clip-path="url(#clip-scene)">
        {/* ===== BELTS ===== */}
        <g id="belts">
          {/* three input lanes */}
          <g className="lane" transform="translate(0 96)">
            <rect x="0" y="0" width="264" height="14" fill="var(--belt)" />
            <rect
              className="stripe"
              x="0"
              y="4"
              width="264"
              height="6"
              fill="url(#stripe)"
            />
            <g className="rollers">
              <circle cx="24" cy="18" r="6" />
              <circle cx="84" cy="18" r="6" />
              <circle cx="144" cy="18" r="6" />
              <circle cx="204" cy="18" r="6" />
              <circle cx="252" cy="18" r="6" />
            </g>
          </g>
          <g className="lane" transform="translate(0 176)">
            <rect x="0" y="0" width="264" height="14" fill="var(--belt)" />
            <rect
              className="stripe"
              x="0"
              y="4"
              width="264"
              height="6"
              fill="url(#stripe)"
            />
            <g className="rollers">
              <circle cx="24" cy="18" r="6" />
              <circle cx="84" cy="18" r="6" />
              <circle cx="144" cy="18" r="6" />
              <circle cx="204" cy="18" r="6" />
              <circle cx="252" cy="18" r="6" />
            </g>
          </g>
          <g className="lane" transform="translate(0 256)">
            <rect x="0" y="0" width="264" height="14" fill="var(--belt)" />
            <rect
              className="stripe"
              x="0"
              y="4"
              width="264"
              height="6"
              fill="url(#stripe)"
            />
            <g className="rollers">
              <circle cx="24" cy="18" r="6" />
              <circle cx="84" cy="18" r="6" />
              <circle cx="144" cy="18" r="6" />
              <circle cx="204" cy="18" r="6" />
              <circle cx="252" cy="18" r="6" />
            </g>
          </g>
          {/* main belt */}
          <g className="lane" transform="translate(352 300)">
            <rect x="0" y="0" width="608" height="14" fill="var(--belt)" />
            <rect
              className="stripe"
              x="0"
              y="4"
              width="608"
              height="6"
              fill="url(#stripe)"
            />
            <g className="rollers">
              <circle cx="20" cy="18" r="6" />
              <circle cx="80" cy="18" r="6" />
              <circle cx="140" cy="18" r="6" />
              <circle cx="200" cy="18" r="6" />
              <circle cx="260" cy="18" r="6" />
              <circle cx="320" cy="18" r="6" />
              <circle cx="380" cy="18" r="6" />
              <circle cx="440" cy="18" r="6" />
              <circle cx="500" cy="18" r="6" />
              <circle cx="560" cy="18" r="6" />
            </g>
          </g>
          {/* feedback loop: down from reviewer, left along the bottom, up into builder */}
          <g id="loop">
            <rect x="756" y="314" width="14" height="60" fill="var(--belt)" />
            <rect
              x="760"
              y="314"
              width="6"
              height="60"
              fill="url(#stripe-v)"
              className="stripe-v"
            />
            <rect x="560" y="366" width="210" height="14" fill="var(--belt)" />
            <rect
              className="stripe-back"
              x="560"
              y="370"
              width="210"
              height="6"
              fill="url(#stripe)"
            />
            <rect x="560" y="314" width="14" height="60" fill="var(--belt)" />
            <rect
              x="564"
              y="314"
              width="6"
              height="60"
              fill="url(#stripe-v)"
              className="stripe-v-up"
            />
            {/* arrows */}
            <g fill="var(--roller)">
              <polygon points="700,364 700,382 690,373" />
              <polygon points="640,364 640,382 630,373" />
            </g>
            <text className="lbl" x="665" y="352" text-anchor="middle">
              CHANGES REQUESTED
            </text>
          </g>
        </g>

        {/* ===== ITEMS (the still frame; the client clears this to animate) ===== */}
        <g id="items">
          <StaticItem id="ticket" x={60} y={72} />
          <StaticItem id="ticket" x={160} y={72} />
          <StaticItem id="repo" x={110} y={152} />
          <StaticItem id="context" x={90} y={232} />
          <StaticItem id="context" x={200} y={232} />
          <StaticItem id="plan" x={400} y={276} />
          <StaticItem id="cube" x={630} y={272} />
          <StaticItem id="cube-ok" x={820} y={272} />
          <StaticItem id="cube-ok" x={900} y={272} />
          <StaticItem id="cube-fix" x={690} y={360} />
        </g>

        {/* ===== MACHINES ===== */}
        <g id="machines">
          {/* PLANNER: tall intake tower. Reads the inputs, types a plan, then a person stamps it. */}
          <g id="planner" transform="translate(264 60)">
            <rect x="0" y="0" width="100" height="254" fill="var(--lilac-2)" />
            <rect x="0" y="0" width="88" height="254" fill="var(--lilac)" />
            <rect x="0" y="0" width="100" height="10" fill="var(--lilac-3)" />
            <rect x="0" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="86" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="0" y="240" width="14" height="14" fill="var(--salmon)" />
            <rect x="86" y="240" width="14" height="14" fill="var(--salmon)" />
            {/* intake slots with a little lip */}
            <rect x="-6" y="30" width="20" height="26" fill="var(--roller)" />
            <rect x="-6" y="56" width="20" height="4" fill="var(--lilac-2)" />
            <rect x="-6" y="110" width="20" height="26" fill="var(--roller)" />
            <rect x="-6" y="136" width="20" height="4" fill="var(--lilac-2)" />
            <rect x="-6" y="190" width="20" height="26" fill="var(--roller)" />
            <rect x="-6" y="216" width="20" height="4" fill="var(--lilac-2)" />
            {/* eyes */}
            <rect x="30" y="34" width="36" height="16" fill="var(--roller)" />
            <g className="eyes">
              <rect x="36" y="38" width="8" height="8" fill="var(--eye)" />
              <rect x="52" y="38" width="8" height="8" fill="var(--eye)" />
            </g>
            {/* screen: the plan gets typed here */}
            <rect x="22" y="88" width="52" height="66" fill="var(--roller)" />
            <rect x="26" y="92" width="44" height="4" fill="var(--lilac-2)" />
            <g className="plan-lines" fill="var(--ok)">
              <rect x="28" y="102" width="32" height="4" />
              <rect x="28" y="110" width="22" height="4" />
              <rect x="28" y="118" width="36" height="4" />
              <rect x="28" y="126" width="18" height="4" />
              <rect x="28" y="134" width="28" height="4" />
            </g>
            <rect
              className="cursor"
              x="28"
              y="142"
              width="6"
              height="4"
              fill="var(--eye)"
            />
            <g className="plan-mark" opacity="0">
              <rect
                x="48"
                y="130"
                width="20"
                height="18"
                fill="var(--salmon)"
                opacity=".9"
              />
              <text
                x="51"
                y="144"
                font-family="VT323, monospace"
                font-size="14"
                fill="#fff"
              >
                OK
              </text>
            </g>
            {/* the human stamp, parked above the screen, drops to approve */}
            <g className="stamp" transform="translate(44 60)">
              <rect x="6" y="0" width="12" height="10" fill="var(--roller)" />
              <rect x="9" y="10" width="6" height="12" fill="var(--roller)" />
              <rect x="0" y="22" width="24" height="6" fill="var(--salmon)" />
            </g>
            {/* status panel */}
            <rect x="22" y="168" width="62" height="22" fill="var(--roller)" />
            <rect
              className="lamp"
              x="26"
              y="174"
              width="10"
              height="10"
              fill="var(--ok)"
              opacity=".25"
            />
            <text
              x="39"
              y="185"
              font-family="VT323, monospace"
              font-size="12"
              fill="#fff"
            >
              APPROVED
            </text>
            {/* out chute to main belt */}
            <rect x="86" y="222" width="20" height="24" fill="var(--roller)" />
            <g fill="var(--lilac-2)">
              <rect x="30" y="206" width="36" height="4" />
              <rect x="30" y="214" width="36" height="4" />
            </g>
            <rect x="60" y="-22" width="16" height="22" fill="var(--lilac-2)" />
            <g className="smoke" fill="var(--lilac-3)" opacity=".8">
              <rect x="62" y="-34" width="12" height="8" />
              <rect x="58" y="-44" width="18" height="8" />
              <rect x="66" y="-54" width="12" height="8" />
            </g>
          </g>

          {/* BUILDER: the assembler. A gantry claw stacks four blocks into a cube. */}
          <g id="builder" transform="translate(470 150)">
            <rect x="0" y="0" width="150" height="150" fill="var(--lilac-2)" />
            <rect x="0" y="0" width="136" height="150" fill="var(--lilac)" />
            <rect x="0" y="0" width="150" height="10" fill="var(--lilac-3)" />
            <rect x="0" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="136" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="0" y="136" width="14" height="14" fill="var(--salmon)" />
            <rect x="136" y="136" width="14" height="14" fill="var(--salmon)" />
            <rect x="52" y="20" width="40" height="16" fill="var(--roller)" />
            <g className="eyes">
              <rect x="58" y="24" width="8" height="8" fill="var(--eye)" />
              <rect x="78" y="24" width="8" height="8" fill="var(--eye)" />
            </g>
            <rect x="60" y="-30" width="20" height="30" fill="var(--lilac-2)" />
            <g className="smoke" fill="var(--lilac-3)" opacity=".8">
              <rect x="62" y="-42" width="16" height="8" />
              <rect x="58" y="-52" width="22" height="8" />
              <rect x="68" y="-62" width="14" height="8" />
            </g>
            <rect x="18" y="44" width="112" height="84" fill="var(--roller)" />
            <rect x="22" y="48" width="104" height="6" fill="var(--belt-2)" />
            <g fill="var(--lilac-2)">
              <rect x="26" y="50" width="4" height="2" />
              <rect x="38" y="50" width="4" height="2" />
              <rect x="50" y="50" width="4" height="2" />
              <rect x="62" y="50" width="4" height="2" />
              <rect x="74" y="50" width="4" height="2" />
              <rect x="86" y="50" width="4" height="2" />
              <rect x="98" y="50" width="4" height="2" />
              <rect x="110" y="50" width="4" height="2" />
            </g>
            <rect x="22" y="96" width="24" height="24" fill="var(--belt-2)" />
            <g className="feed">
              <use href="#blk" x="26" y="100" />
            </g>
            <rect x="66" y="118" width="56" height="6" fill="var(--belt-2)" />
            <g className="built" />
            <g className="carriage">
              <rect
                x="-10"
                y="46"
                width="20"
                height="10"
                fill="var(--salmon)"
              />
              <g className="hoist">
                <rect
                  x="-2"
                  y="56"
                  width="4"
                  height="10"
                  fill="var(--salmon)"
                />
                <rect
                  x="-8"
                  y="66"
                  width="16"
                  height="6"
                  fill="var(--salmon)"
                />
                <rect x="-8" y="72" width="4" height="8" fill="var(--salmon)" />
                <rect x="4" y="72" width="4" height="8" fill="var(--salmon)" />
                <g className="held" />
              </g>
            </g>
            <g className="sparks" fill="var(--eye)">
              <rect x="100" y="110" width="3" height="3" />
              <rect x="112" y="104" width="3" height="3" />
              <rect x="92" y="100" width="3" height="3" />
            </g>
            <rect
              className="flash"
              x="18"
              y="44"
              width="112"
              height="84"
              fill="#fff"
              opacity="0"
            />
            <rect x="-6" y="118" width="12" height="30" fill="var(--roller)" />
            <rect x="144" y="118" width="12" height="30" fill="var(--roller)" />
            <rect x="90" y="142" width="14" height="10" fill="var(--roller)" />
          </g>

          {/* REVIEWER: scans the cube, gives a verdict, then a person signs it off */}
          <g id="reviewer" transform="translate(660 190)">
            <rect x="0" y="0" width="120" height="110" fill="var(--lilac-2)" />
            <rect x="0" y="0" width="108" height="110" fill="var(--lilac)" />
            <rect x="0" y="0" width="120" height="10" fill="var(--lilac-3)" />
            <rect x="0" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="106" y="0" width="14" height="14" fill="var(--salmon)" />
            <rect x="0" y="96" width="14" height="14" fill="var(--salmon)" />
            <rect x="106" y="96" width="14" height="14" fill="var(--salmon)" />
            <rect x="40" y="16" width="36" height="14" fill="var(--roller)" />
            <g className="eyes">
              <rect x="46" y="19" width="8" height="8" fill="var(--eye)" />
              <rect x="62" y="19" width="8" height="8" fill="var(--eye)" />
            </g>
            <rect x="14" y="36" width="88" height="56" fill="var(--roller)" />
            <clipPath id="clip-rev">
              <rect x="14" y="36" width="88" height="56" />
            </clipPath>
            <g clip-path="url(#clip-rev)">
              <g className="review-cube" transform="translate(26 54)">
                <use href="#cube" />
              </g>
            </g>
            <rect
              className="scan"
              x="16"
              y="38"
              width="46"
              height="3"
              fill="var(--lilac-3)"
              opacity="0"
            />
            <g className="lens" transform="translate(28 42)">
              <rect x="6" y="0" width="16" height="4" fill="var(--lilac-3)" />
              <rect x="2" y="4" width="4" height="4" fill="var(--lilac-3)" />
              <rect x="22" y="4" width="4" height="4" fill="var(--lilac-3)" />
              <rect x="0" y="8" width="4" height="12" fill="var(--lilac-3)" />
              <rect x="24" y="8" width="4" height="12" fill="var(--lilac-3)" />
              <rect x="2" y="20" width="4" height="4" fill="var(--lilac-3)" />
              <rect x="22" y="20" width="4" height="4" fill="var(--lilac-3)" />
              <rect x="6" y="24" width="16" height="4" fill="var(--lilac-3)" />
              <rect
                x="4"
                y="4"
                width="20"
                height="20"
                fill="#E4F0FA"
                opacity=".45"
              />
              <rect
                x="22"
                y="26"
                width="6"
                height="14"
                fill="var(--salmon)"
                transform="rotate(-45 25 26)"
              />
            </g>
            {/* the human stamp on the right of the window */}
            <g className="stamp" transform="translate(70 38)">
              <rect x="6" y="0" width="12" height="10" fill="var(--lilac-3)" />
              <rect x="9" y="10" width="6" height="12" fill="var(--lilac-3)" />
              <rect x="0" y="22" width="24" height="6" fill="var(--salmon)" />
            </g>
            <g className="sign-mark" opacity="0">
              <rect
                x="70"
                y="70"
                width="24"
                height="18"
                fill="var(--salmon)"
                opacity=".9"
              />
              <text
                x="74"
                y="84"
                font-family="VT323, monospace"
                font-size="14"
                fill="#fff"
              >
                OK
              </text>
            </g>
            <rect
              className="verdict"
              x="14"
              y="94"
              width="88"
              height="4"
              fill="var(--ok)"
              opacity="0"
            />
            <rect x="-6" y="78" width="12" height="30" fill="var(--roller)" />
            <rect x="114" y="78" width="12" height="30" fill="var(--roller)" />
            <rect x="52" y="102" width="14" height="10" fill="var(--roller)" />
          </g>
        </g>

        {/* ===== LABELS ===== */}
        <g id="labels">
          <text className="lbl" x="12" y="136">
            TICKETS
          </text>
          <text className="lbl" x="12" y="216">
            CODE
          </text>
          <text className="lbl" x="12" y="296">
            CONTEXT
          </text>
          <text className="lbl strong" x="314" y="404" text-anchor="middle">
            PLAN
          </text>
          <text className="lbl strong" x="545" y="404" text-anchor="middle">
            BUILD
          </text>
          <text className="lbl strong" x="720" y="404" text-anchor="middle">
            REVIEW
          </text>
          <text className="lbl strong" x="900" y="404" text-anchor="middle">
            SHIP
          </text>
          <text className="lbl" x="314" y="422" text-anchor="middle">
            humans approve
          </text>
          <text className="lbl" x="545" y="422" text-anchor="middle">
            agents code
          </text>
          <text className="lbl" x="720" y="422" text-anchor="middle">
            agents, then humans
          </text>
          <text className="lbl" x="900" y="422" text-anchor="middle">
            humans merge
          </text>
        </g>
      </g>
    </svg>
  );
}
