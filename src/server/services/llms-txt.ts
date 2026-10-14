import { absolute, SITE_DESCRIPTION, SITE_NAME } from "./seo";

// Builds the /llms.txt body — the emerging convention that gives LLMs and AI
// agents a short, curated markdown index of the site. Unlike the sitemap (an
// exhaustive machine list of URLs), this is a hand-written summary with a
// one-line description per page. It controls nothing; it is purely a hint.
//
// The page list is kept in sync with the public routes by a drift test in
// llms-txt.test.ts, so a new public page can't silently go unlisted.

interface LlmsPage {
  path: string;
  title: string;
  description: string;
}

const PAGES: LlmsPage[] = [
  {
    path: "/",
    title: "Alex Price",
    description:
      "Alex Price helps startups move from using coding agents to running them: a pipeline that turns tickets into reviewed pull requests, with humans at both ends.",
  },
  {
    path: "/software-factory",
    title: "Software factory",
    description:
      "What a software factory is: a repeatable loop of AI agents that plan, build and review work, with people approving the plan and signing off the change.",
  },
];

const RESOURCES: LlmsPage[] = [
  {
    path: "/sitemap.xml",
    title: "Sitemap",
    description: "XML sitemap of every public page.",
  },
  {
    path: "/.well-known/security.txt",
    title: "Security policy",
    description: "How to report a security vulnerability (RFC 9116).",
  },
];

const linkLine = ({ path, title, description }: LlmsPage): string =>
  `- [${title}](${absolute(path)}): ${description}`;

export const buildLlmsTxt = (): string =>
  [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Pages",
    "",
    ...PAGES.map(linkLine),
    "",
    "## Resources",
    "",
    ...RESOURCES.map(linkLine),
    "",
  ].join("\n");
