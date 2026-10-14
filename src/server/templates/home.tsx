import { FactoryHome } from "@server/components/factory-home";
import { Layout } from "@server/components/layouts";

export const Home = () => (
  <Layout title="Alex Price" page="home" canonicalPath="/">
    <header className="hero" id="top">
      <h1>
        Helping teams build the <em>factory</em> that builds their software.
      </h1>
      <p>
        I help startups move from using coding agents to running them: a
        pipeline that turns tickets into reviewed pull requests, with humans at
        both ends.
      </p>
      <div className="cta">
        <a className="btn primary" href="#contact">
          WORK WITH ME
        </a>
      </div>

      <div className="factory" id="factory">
        <div className="scroller">
          <FactoryHome />
        </div>
        <p className="factory-link">
          <a href="/software-factory">What is a software factory? →</a>
        </p>
      </div>
    </header>

    <section id="about">
      <h2>
        Years of shipping, now mostly spent building the factories that do it.
      </h2>
      <div className="prose">
        <p>
          I'm Alex Price. I've founded several companies and co-founded and
          exited Ecologi. Today I run <a href="https://chptrs.tech">∞CHPTRS</a>{" "}
          with Annette, a two-person software and product consultancy for
          seed-to-Series A founders, where I cover engineering and technology.
        </p>
        <p>
          For years that meant stepping in as the technical lead: setting
          direction, hiring and unblocking teams, and building the first version
          of the thing when there was nobody else to do it. Now it means helping
          teams design, build and run their own software factory: the agent
          pipeline that does the building, with their people deciding what gets
          built and what ships.
        </p>
        <p>
          That experience is the point. A factory without guardrails just ships
          mistakes faster. Knowing where to put the gates, how much back
          pressure a team can absorb, and what an agent should never be allowed
          to do on its own is the difference between a pipeline you trust and
          one you babysit. Years of running engineering teams and shipping
          products is what lets me design those guardrails well.
        </p>
        <p>
          I run a factory of my own across my client work, which is where the
          ideas on the <a href="/software-factory">software factory page</a>{" "}
          come from. Default stack: TypeScript on Bun, PostgreSQL, Railway and
          Cloudflare, starting from my open-source starter, Billet, so coding
          agents begin on a base they already understand.
        </p>
      </div>
    </section>

    <section id="work">
      <h2>Selected things I've built or run.</h2>
      <div className="work">
        <div className="card">
          <div className="role">CO-FOUNDER · ENGINEERING</div>
          <h3>
            <a href="https://chptrs.tech">∞CHPTRS</a>
          </h3>
          <p>
            Software and product for early-stage founders. Engineering, product
            and ops delivered by a team of two and a software factory.
          </p>
        </div>
        <div className="card">
          <div className="role">OPEN SOURCE</div>
          <h3>
            <a href="https://billet.alexprice.dev">Billet</a>
          </h3>
          <p>
            A full-stack TypeScript starter: server-rendered JSX on Bun with
            PostgreSQL, deployed to Railway. Built to be extended by AI coding
            agents.
          </p>
        </div>
        <div className="card">
          <div className="role">CO-FOUNDER · EXITED</div>
          <h3>
            <a href="https://ecologi.com">Ecologi</a>
          </h3>
          <p>
            The UK's most trusted climate action platform and a LinkedIn Top 10
            Startup in 2022.
          </p>
        </div>
      </div>
    </section>

    <section id="contact">
      <h2>Curious about software factories?</h2>
      <div className="prose">
        <p>
          I work with a small number of startups at a time, helping them design,
          build and run their own software factory. If you're wondering what one
          could do for your team, or just want to compare notes, get in touch.
        </p>
      </div>
      <div className="contact">
        <span className="mail" id="mail">
          alex@chptrs.tech
        </span>
        <button type="button" className="copy" id="copy-mail">
          COPY
        </button>
      </div>
    </section>
  </Layout>
);
