import { children, ParentComponent } from "solid-js";

const CardWrapper: ParentComponent = ({ children }) => (
  <div
    class="h-[12cm] w-[7cm] inline-block mr-4 mb-4 border border-grey-200 print:border-0"
    style={{
      "page-break-inside": "avoid",
    }}
  >
    {children}
  </div>
);

export default CardWrapper;
