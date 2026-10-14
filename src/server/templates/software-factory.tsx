import { FactoryBoard } from "@server/components/factory-board";
import { Layout } from "@server/components/layouts";

const DESCRIPTION =
  "What a software factory is: a loop of AI agents that plans, builds and reviews work, with people approving and shipping.";

export const SoftwareFactory = () => (
  <Layout
    title="Software Factory"
    description={DESCRIPTION}
    canonicalPath="/software-factory"
    page="software-factory"
  >
    <section id="shift" className="first">
      <p className="eyebrow">Why now</p>
      <h2>The way we build software has changed, and changed again.</h2>
      <div className="prose">
        <p>
          First, AI coding agents were assistants. They sat beside a developer,
          finished the line, explained the error, drafted the function. The
          developer still did the building; the agent made them faster.
        </p>
        <p>
          Then the agents could take a whole task. Give one a ticket and a repo
          and it would come back with a branch. The developer's day moved from
          writing code to directing agents and reading what came back.
        </p>
        <p>
          Now the agents are the bones of the factory itself. They plan, build,
          review and hand off to each other, on a schedule, without anyone
          typing. Where the energy is spent has moved again, this time to
          designing the pipeline and making the two decisions that matter: what
          to build, and whether to ship it.
        </p>
        <p>
          The economics moved with it. The cost of producing a working change
          has collapsed; the scarce things are good judgement at the gates and a
          pipeline that can be trusted to run without you. That is what a
          software factory is for.
        </p>
      </div>
    </section>

    <section id="how">
      <p className="eyebrow">What a software factory is</p>
      <h2>A ticket goes in. A reviewed pull request comes out.</h2>
      <div className="prose">
        <p>
          A software factory is a repeatable loop of AI coding agents wired into
          the tools a team already uses: the task board, the repo, the review
          process. Agents do the work in the middle. People hold the two ends: a
          person approves every plan before anything is built, and a person
          signs off every change before it ships. Three stages, two human gates,
          and a paper trail on every ticket.
        </p>
      </div>
      <div className="factory" id="factory2">
        <div className="scroller">
          <FactoryBoard />
        </div>
      </div>
      <div className="stages">
        <div className="stage">
          <div className="k">
            <i />
            STAGE 1 · HUMAN GATE
          </div>
          <h3>Plan</h3>
          <p>
            An agent reads the ticket, the codebase and the surrounding context,
            then proposes a plan where the team can see it. A person reads that
            plan, pushes back, and approves it. Nothing gets built until they
            do.
          </p>
        </div>
        <div className="stage">
          <div className="k">
            <i />
            STAGE 2 · AGENTS
          </div>
          <h3>Build</h3>
          <p>
            Approved plans are built in isolated sandboxes, with big pieces of
            work split into phases. Each phase becomes a branch and a pull
            request, using whichever model suits the project and its
            constraints.
          </p>
        </div>
        <div className="stage">
          <div className="k">
            <i />
            STAGE 3 · HUMAN GATE
          </div>
          <h3>Review</h3>
          <p>
            A separate agent reviews every pull request for correctness,
            performance, refactoring and UI polish, and sends changes straight
            back to the builder. Then a person reviews it. Because the agent has
            already done the first pass, the human review is sharp and quick,
            and nothing merges without their sign-off.
          </p>
        </div>
      </div>
    </section>

    <section id="why">
      <p className="eyebrow">Where the safety comes from</p>
      <h2>Humans at both ends. Agents in the middle.</h2>
      <div className="prose">
        <p>
          The factory does not take people out of the loop. It moves them to the
          two places where judgement matters most. At the start, a person
          decides what gets built and how, by approving the plan. At the end, a
          person decides what ships, by reviewing the change and merging it.
          Everything between those two points is repeatable, so it can be
          automated, measured and improved.
        </p>
        <p>
          Those two gates are the whole safety model. An agent can only build
          what a person has agreed to, and nothing it builds reaches production
          without a person reading it. Every plan and every review leaves a
          paper trail on the ticket, so the team can always answer who decided
          what, and why.
        </p>
        <p>
          For an early-stage team that means a roadmap moving at a pace that
          would otherwise need a much bigger engineering team, with human
          judgement on every change rather than less of it.
        </p>
        <p>
          The gates are only as good as the judgement that designed them: where
          to apply back pressure, what to let through automatically, and what no
          agent should ever do on its own. That judgement comes from having run
          engineering teams and shipped products long before agents could, which
          is what I bring to building yours.
        </p>
      </div>
    </section>

    <section id="cta">
      <p className="eyebrow">Next step</p>
      <h2>Want one for your team?</h2>
      <div className="prose">
        <p>
          I help startups design and build their own, from the first agent to a
          pipeline the team trusts to run on its own. Tell me what you're
          building and where it's stuck.
        </p>
      </div>
      <div className="cta" style={{ marginTop: "22px" }}>
        <a className="btn primary" href="/#contact">
          WORK WITH ME
        </a>
      </div>
    </section>
  </Layout>
);
