import { gsap } from "gsap";

// The software factory explainer: cards leave the task board, pass through three
// agent sandboxes, and land in the pull-request stack, which steadily merges.
//
// The board and the PR stack are server-rendered with a still frame; this clears
// it and takes over, except under `prefers-reduced-motion`, where the still frame
// is the answer.

const NS = "http://www.w3.org/2000/svg";

export function initSoftwareFactory(): void {
  const scene = document.getElementById("scene2");
  const todo = document.getElementById("todo");
  const fly = document.getElementById("flying1");
  const prs = document.getElementById("prs");
  const mcount = document.getElementById("mcount");
  if (!(scene && todo && fly && prs && mcount)) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  todo.replaceChildren();
  prs.replaceChildren();
  fly.replaceChildren();
  mcount.textContent = "0";

  gsap.defaults({ ease: "none" });

  const use = (
    parent: Element,
    id: string,
    x: number,
    y: number,
  ): SVGGElement => {
    const g = document.createElementNS(NS, "g");
    const u = document.createElementNS(NS, "use");
    u.setAttribute("href", `#${id}`);
    g.appendChild(u);
    parent.appendChild(g);
    gsap.set(g, { x, y });
    return g;
  };

  gsap.utils.toArray<SVGElement>("#scene2 .eyes").forEach((el, i) => {
    gsap
      .timeline({ repeat: -1, repeatDelay: 2.2 + i * 0.9, delay: i * 0.5 })
      .to(el, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.08 })
      .to(el, { scaleY: 1, duration: 0.08 });
  });
  gsap.to("#scene2 .cursor", {
    opacity: 0,
    duration: 0.3,
    yoyo: true,
    repeat: -1,
  });
  gsap.utils.toArray<SVGElement>("#scene2 .work rect").forEach((r, i) => {
    gsap.fromTo(
      r,
      { scaleX: 0.3, transformOrigin: "0 50%" },
      {
        scaleX: 1,
        duration: 0.8 + i * 0.1,
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.4,
        delay: i * 0.3,
      },
    );
  });
  gsap.to("#scene2 .wires path", {
    strokeDashoffset: -28,
    duration: 1,
    repeat: -1,
  });

  const boxY = [80, 200, 320];
  const busy = [false, false, false];
  const cards: SVGGElement[] = [];
  const stack: SVGGElement[] = [];
  let merged = 0;

  // seed the to-do column
  for (let i = 0; i < 6; i++) {
    cards.push(use(todo, "card1", 10, 70 + i * 40));
  }

  const layoutStack = (): void => {
    stack.forEach((g, i) => {
      gsap.to(g, { x: 12, y: 44 + i * 40, duration: 0.3 });
    });
  };

  const dispatch = (): void => {
    const free = busy.indexOf(false);
    if (free < 0 || cards.length === 0) return;
    busy[free] = true;
    const card = cards.shift();
    if (!card) return;

    // shift remaining cards up
    cards.forEach((g, i) => {
      gsap.to(g, { y: 70 + i * 40, duration: 0.3 });
    });
    fly.appendChild(card);
    gsap.set(card, { x: 30, y: 100 });

    const tl = gsap.timeline();
    tl.to(card, {
      x: 150,
      y: boxY[free] - 15,
      duration: 0.5,
      ease: "power1.inOut",
    }); // into DOING
    tl.to({}, { duration: 0.4 });
    tl.to(card, {
      x: 420,
      y: boxY[free] - 15,
      duration: 0.7,
      ease: "power1.in",
    }); // into the sandbox
    tl.to(card, { opacity: 0, duration: 0.1 });
    tl.to({}, { duration: 2 + Math.random() * 2 }); // working
    tl.call(() => {
      card.remove();
      busy[free] = false;
      const pr = use(fly, "pr1", 540, boxY[free] - 15);
      gsap.set(pr, { opacity: 0 });
      const t2 = gsap.timeline();
      t2.to(pr, { opacity: 1, duration: 0.1 });
      t2.to(pr, {
        x: 732,
        y: 74 + stack.length * 40,
        duration: 0.8,
        ease: "power1.inOut",
      });
      t2.call(() => {
        prs.appendChild(pr);
        // convert to panel coordinates on reparent
        gsap.set(pr, { x: 12, y: Number(gsap.getProperty(pr, "y")) - 30 });
        stack.push(pr);
        layoutStack();
      });
      // refill the board
      const next = use(todo, "card1", 10, 70 + cards.length * 40);
      gsap.from(next, { opacity: 0, x: -40, duration: 0.3 });
      cards.push(next);
    });
  };

  const merge = (): void => {
    const pr = stack.shift();
    if (!pr) return;
    const tl = gsap.timeline({
      onComplete: () => {
        pr.remove();
        merged++;
        mcount.textContent = String(merged);
        layoutStack();
      },
    });
    tl.to(pr, { x: 12, y: 274, duration: 0.6, ease: "power1.inOut" }); // down into the tally
    tl.to(
      pr,
      { scaleY: 0, transformOrigin: "50% 100%", opacity: 0, duration: 0.25 },
      "-=0.05",
    );
    tl.fromTo(
      "#merged",
      { x: 0 },
      { x: 4, duration: 0.08, yoyo: true, repeat: 1 },
      "<",
    );
  };

  gsap
    .timeline({ repeat: -1 })
    .call(dispatch, undefined, 0)
    .to({}, { duration: 1.1 });
  gsap
    .timeline({ repeat: -1, delay: 6 })
    .call(merge, undefined, 0)
    .to({}, { duration: 1.6 });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        gsap.globalTimeline.paused(!entries[0].isIntersecting);
      },
      { threshold: 0.05 },
    ).observe(scene);
  }
}
