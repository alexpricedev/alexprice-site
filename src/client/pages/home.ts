import { gsap } from "gsap";

// The home page: the hero automation on the software-factory diagram, and the
// copy-email button.
//
// The diagram is server-rendered with a still frame in `#items`, so the page is
// legible with JavaScript off and honours `prefers-reduced-motion` without any
// client work. When motion is welcome the still frame is cleared and the belts,
// the machines and the main line take over.

const NS = "http://www.w3.org/2000/svg";

/** Query an element the server-rendered template guarantees exists. */
const q = <T extends Element>(selector: string): T =>
  document.querySelector(selector) as T;

export function initHome(): void {
  initCopyEmail();
  initFactory();
}

function initCopyEmail(): void {
  const button = document.getElementById("copy-mail");
  const mail = document.getElementById("mail");
  if (!(button && mail)) return;

  button.addEventListener("click", () => {
    const text = (mail.textContent ?? "").trim();

    const done = (ok: boolean): void => {
      button.textContent = ok ? "COPIED" : "SELECT & COPY";
      setTimeout(() => {
        button.textContent = "COPY";
      }, 1600);
    };

    const select = (): void => {
      const range = document.createRange();
      range.selectNodeContents(mail);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => done(true),
        () => {
          select();
          done(false);
        },
      );
    } else {
      select();
      done(false);
    }
  });
}

function initFactory(): void {
  const svg = document.getElementById("scene");
  const items = document.getElementById("items");
  if (!(svg && items)) return;

  // The server-rendered still frame is the reduced-motion answer already.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  items.replaceChildren();

  const make = (id: string, x: number, y: number): SVGGElement => {
    const g = document.createElementNS(NS, "g");
    const use = document.createElementNS(NS, "use");
    use.setAttribute("href", `#${id}`);
    g.appendChild(use);
    g.setAttribute("transform", `translate(${x} ${y})`);
    items.appendChild(g);
    return g;
  };

  const swap = (g: SVGGElement, id: string): void => {
    g.firstElementChild?.setAttribute("href", `#${id}`);
  };

  gsap.defaults({ ease: "none" });

  // belts: scroll the stripe patterns by nudging x/y; rollers ride the same loop
  gsap.utils.toArray<SVGElement>(".stripe").forEach((el) => {
    gsap.fromTo(el, { x: -16 }, { x: 0, duration: 0.6, repeat: -1 });
  });
  gsap.to(".stripe-back", {
    x: -16,
    duration: 0.6,
    repeat: -1,
    overwrite: true,
  });
  gsap.fromTo(".stripe-v", { y: -16 }, { y: 0, duration: 0.6, repeat: -1 });
  gsap.to(".stripe-v-up", { y: -16, duration: 0.6, repeat: -1 });

  // idle machine life
  gsap.utils.toArray<SVGElement>(".eyes").forEach((el, i) => {
    gsap
      .timeline({ repeat: -1, repeatDelay: 2.4 + i * 1.1, delay: i * 0.7 })
      .to(el, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.08 })
      .to(el, { scaleY: 1, duration: 0.08 });
  });
  gsap.utils.toArray<SVGElement>(".smoke").forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 0, opacity: 0.8 },
      {
        y: -18,
        opacity: 0,
        duration: 2.2,
        repeat: -1,
        delay: i * 0.9,
        ease: "power1.out",
      },
    );
  });
  gsap.to(".sparks rect", {
    opacity: 0,
    duration: 0.12,
    stagger: { each: 0.15, repeat: -1, yoyo: true },
  });
  gsap.to("#planner .cursor", {
    opacity: 0,
    duration: 0.35,
    yoyo: true,
    repeat: -1,
  });

  /* ---- machines: each returns a timeline the item timeline waits on ---- */

  const planner = (() => {
    const lines = gsap.utils.toArray<SVGElement>("#planner .plan-lines rect");
    gsap.set(lines, { scaleX: 0, transformOrigin: "0 50%" });
    return {
      run(): gsap.core.Timeline {
        const tl = gsap.timeline();
        tl.set(lines, { scaleX: 0 });
        tl.set("#planner .plan-mark", { opacity: 0 });
        tl.set("#planner .lamp", { opacity: 0.25 });
        tl.to(lines, { scaleX: 1, duration: 0.25, stagger: 0.22 }); // agent types the plan
        tl.to({}, { duration: 0.35 });
        tl.to("#planner .stamp", { y: 10, duration: 0.14, ease: "power2.in" }); // a person stamps it
        tl.set("#planner .plan-mark", { opacity: 1 });
        tl.set("#planner .lamp", { opacity: 1 });
        tl.to("#planner .stamp", { y: 0, duration: 0.3 });
        tl.to({}, { duration: 0.3 });
        return tl; // ~2.6s
      },
    };
  })();

  const builder = (() => {
    const car = q<SVGElement>("#builder .carriage");
    const hoist = q<SVGElement>("#builder .hoist");
    const held = q<SVGElement>("#builder .held");
    const built = q<SVGElement>("#builder .built");
    const feed = q<SVGElement>("#builder .feed");
    const FEED_X = 34;
    const slots: [number, number][] = [
      [84, 102],
      [100, 102],
      [84, 86],
      [100, 86],
    ];
    const LEN = 3.2;
    let busy = false;

    gsap.set(car, { x: FEED_X });

    const blk = (parent: Element, x: number, y: number): SVGUseElement => {
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#blk");
      use.setAttribute("x", String(x));
      use.setAttribute("y", String(y));
      parent.appendChild(use);
      return use;
    };

    return {
      run(): gsap.core.Timeline {
        // already mid-build: just wait it out
        if (busy) return gsap.timeline().to({}, { duration: LEN });
        busy = true;
        const tl = gsap.timeline({
          onComplete: () => {
            busy = false;
          },
        });
        tl.set(car, { x: FEED_X });
        tl.set(hoist, { y: 0 });
        tl.call(() => {
          built.innerHTML = "";
          held.innerHTML = "";
          feed.style.opacity = "1";
        });
        for (const [slotX, slotY] of slots) {
          let carry: SVGUseElement | undefined;
          tl.to(hoist, { y: 20, duration: 0.3, ease: "power1.in" });
          tl.call(() => {
            feed.style.opacity = "0";
            carry = blk(held, -8, 80);
          });
          tl.to(hoist, { y: 0, duration: 0.3 });
          tl.to(car, { x: slotX + 8, duration: 0.5, ease: "power1.inOut" });
          tl.to(hoist, { y: slotY - 80, duration: 0.3, ease: "power1.in" });
          tl.call(() => {
            carry?.remove();
            blk(built, slotX, slotY);
          });
          tl.to(hoist, { y: 0, duration: 0.25 });
          tl.to(car, { x: FEED_X, duration: 0.45, ease: "power1.inOut" });
          tl.call(() => {
            feed.style.opacity = "1";
          });
        }
        tl.to("#builder .flash", {
          opacity: 0.5,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
        });
        // the four blocks become one cube, which slides to the port, drops to
        // belt level and rolls out
        tl.call(() => {
          built.innerHTML = "";
          const use = document.createElementNS(NS, "use");
          use.setAttribute("href", "#cube");
          use.setAttribute("x", "85");
          use.setAttribute("y", "90");
          built.appendChild(use);
        });
        tl.to(built, { x: 34, duration: 0.35, ease: "power1.inOut" });
        tl.to(built, { y: 32, duration: 0.25, ease: "power1.in" });
        tl.to(built, { x: 66, duration: 0.4 });
        tl.set(built, { x: 0, y: 0 });
        tl.call(() => {
          built.innerHTML = "";
        });
        tl.timeScale(tl.duration() / LEN);
        // wrapper so callers wait exactly LEN
        return gsap.timeline().add(tl).to({}, { duration: 0 });
      },
    };
  })();

  const reviewer = (() => {
    const cube = q<SVGElement>("#reviewer .review-cube use");
    return {
      run(ok: boolean): gsap.core.Timeline {
        const tl = gsap.timeline();
        tl.set(cube, { attr: { href: "#cube" } });
        tl.set("#reviewer .sign-mark", { opacity: 0 });
        tl.set("#reviewer .verdict", { opacity: 0 });
        tl.set("#reviewer .review-cube", { x: -50, y: 12 });
        tl.to("#reviewer .review-cube", { x: 0, duration: 0.3 }); // cube in from the port
        tl.to("#reviewer .review-cube", { y: 0, duration: 0.2 }); // onto the inspection plate
        tl.set("#reviewer .scan", { opacity: 0.7, y: 0 });
        tl.to("#reviewer .scan", {
          y: 48,
          duration: 0.6,
          repeat: 1,
          yoyo: true,
          ease: "steps(12)",
        }); // scan line
        tl.to(
          "#reviewer .lens",
          { x: 10, duration: 0.3, yoyo: true, repeat: 3, ease: "steps(4)" },
          "<",
        );
        tl.set("#reviewer .scan", { opacity: 0 });
        tl.set("#reviewer .verdict", {
          attr: { fill: ok ? "var(--ok)" : "var(--warn)" },
          opacity: 1,
        });
        tl.set(cube, { attr: { href: ok ? "#cube-ok" : "#cube-fix" } });
        if (ok) {
          // a person signs it off
          tl.to(
            "#reviewer .stamp",
            { y: 14, duration: 0.14, ease: "power2.in" },
            "+=0.2",
          );
          tl.set("#reviewer .sign-mark", { opacity: 1 });
          tl.to("#reviewer .stamp", { y: 0, duration: 0.3 });
          tl.to({}, { duration: 0.2 });
        } else {
          tl.to("#reviewer .verdict", {
            opacity: 0.2,
            duration: 0.15,
            yoyo: true,
            repeat: 3,
          });
        }
        tl.to("#reviewer .verdict", { opacity: 0, duration: 0.3 });
        tl.to("#reviewer .review-cube", { y: 12, duration: 0.2 }, "<");
        tl.to("#reviewer .review-cube", { x: 90, duration: 0.3 }); // out the other side
        return tl; // ~2.2s
      },
    };
  })();

  // input lanes: a steady drip of tickets, repo snapshots and context docs
  const lanes = [
    { id: "ticket", y: 72, every: 2.6 },
    { id: "repo", y: 152, every: 3.4 },
    { id: "context", y: 232, every: 3.0 },
  ];
  lanes.forEach((lane, i) => {
    const spawn = (): void => {
      const g = make(lane.id, 0, 0);
      gsap.set(g, { x: -40, y: lane.y });
      gsap.to(g, {
        x: 300,
        duration: 5.6,
        onComplete: () => {
          g.remove();
        },
      });
    };
    gsap.delayedCall(i * 0.8, spawn);
    gsap
      .timeline({ repeat: -1, delay: i * 0.8 + lane.every })
      .call(spawn, undefined, 0)
      .to({}, { duration: lane.every });
  });

  // main line: plan -> build -> review -> merge, every fourth build sent round
  // the loop
  const SPEED = 60; // px per second on the belt
  let count = 0;
  const seg = (d: number): number => d / SPEED;

  const runItem = (): void => {
    count++;
    const fixRound = count % 4 === 0;
    const g = make("plan", 0, 0);
    gsap.set(g, { x: 300, y: 276, opacity: 0 });
    const tl = gsap.timeline({
      onComplete: () => {
        g.remove();
      },
    });
    tl.add(planner.run()); // plan typed, person approves
    tl.set(g, { opacity: 1 });
    tl.to(g, { x: 470, duration: seg(170) }); // plan rides into the builder
    tl.call(() => {
      swap(g, "cube");
      gsap.set(g, { x: 620, y: 272, opacity: 0 });
    });
    tl.add(builder.run()); // assembled; the cube rolls out of the port
    tl.set(g, { opacity: 1 });
    tl.to(g, { x: 660, duration: seg(40) }); // into the reviewer
    tl.add(reviewer.run(!fixRound)); // scanned, verdict
    if (fixRound) {
      tl.call(() => {
        swap(g, "cube-fix");
        gsap.set(g, { x: 748, y: 318 });
      });
      tl.to(g, { y: 352, duration: seg(34) }); // down the drop
      tl.to(g, { x: 556, duration: seg(192) }); // back along the bottom
      tl.to(g, { y: 318, duration: seg(34) }); // up into the builder
      tl.call(() => {
        swap(g, "cube");
        gsap.set(g, { x: 620, y: 272, opacity: 0 });
      });
      tl.add(builder.run());
      tl.set(g, { opacity: 1 });
      tl.to(g, { x: 660, duration: seg(40) });
      tl.add(reviewer.run(true)); // second time it passes and gets signed off
    }
    tl.call(() => {
      swap(g, "cube-ok");
      gsap.set(g, { x: 780, y: 272 });
    });
    tl.to(g, { x: 1000, duration: seg(220) }); // off the edge, merged
  };

  runItem();
  gsap
    .timeline({ repeat: -1, delay: 4.2 })
    .call(runItem, undefined, 0)
    .to({}, { duration: 4.2 });

  // save cycles when the hero is off screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        gsap.globalTimeline.paused(!entries[0].isIntersecting);
      },
      { threshold: 0.05 },
    ).observe(svg);
  }
}
