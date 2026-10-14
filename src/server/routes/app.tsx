import {
  home,
  llmsTxt,
  robotsTxt,
  securityTxt,
  sitemap,
  softwareFactory,
  webmanifest,
} from "../controllers/app";
import { createRouteHandler } from "../utils/route-handler";

export const appRoutes = {
  "/": createRouteHandler({ GET: home.index }),
  "/software-factory": createRouteHandler({ GET: softwareFactory.index }),
  "/robots.txt": robotsTxt.index,
  "/site.webmanifest": webmanifest.index,
  "/sitemap.xml": sitemap.index,
  "/llms.txt": llmsTxt.index,
  "/.well-known/security.txt": securityTxt.index,
};
