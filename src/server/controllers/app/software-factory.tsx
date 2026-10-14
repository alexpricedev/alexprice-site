import { SoftwareFactory } from "../../templates/software-factory";
import { render } from "../../utils/response";

export const softwareFactory = {
  index(): Response {
    return render(<SoftwareFactory />);
  },
};
