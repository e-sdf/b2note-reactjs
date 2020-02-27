import * as React from "react";
import type { SectionProps } from "./defs";

export function SearchSection(props: SectionProps): React.FunctionComponentElement<SectionProps> {
  return (
    <>
      <h2>{props.header}</h2>
      <p>
        Etiam volutpat odio et rhoncus ultrices. Ut dapibus porttitor dolor, nec porttitor nulla accumsan at. Nullam dictum nunc ex, quis egestas mauris blandit sed. Integer rhoncus ipsum eu dictum mattis. Aenean vitae enim ex. Quisque a nibh quis nibh interdum convallis nec nec elit. Vivamus ultrices enim a fringilla congue.
      </p>
    </>
  );
}

