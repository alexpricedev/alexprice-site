import { initHome } from "@client/pages/home";
import { initSoftwareFactory } from "@client/pages/software-factory";

// One bundle for the whole site. Each page opts in by name, so a page that
// needs no behaviour (an error page carries no bundle at all) costs nothing.
const page = document.body.dataset.page;

if (page === "home") {
  initHome();
}

if (page === "software-factory") {
  initSoftwareFactory();
}
