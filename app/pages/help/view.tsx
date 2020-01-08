import _ from "lodash";
import { $enum } from "ts-enum-util";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { matchSwitch } from "@babakness/exhaustive-type-checking";
import { AnnotateHelp } from "./annotate";
import { AnnotationsHelp } from "./annotations";
import { SearchHelp } from "./search";
import { ProfileHelp } from "./profile";

export enum HelpSection {
  ANNOTATE = "annotate",
  ANNOTATIONS = "annotations",
  SEARCH = "search",
  PROFILE = "profile",
  TOC = "toc"
}

export function header(section: HelpSection): string {
  return matchSwitch(section, {
    [HelpSection.ANNOTATE]: () => "Annotating",
    [HelpSection.ANNOTATIONS]: () => "List of Annotations",
    [HelpSection.SEARCH]: () => "Searching Annotations",
    [HelpSection.PROFILE]: () => "User Profile",
    [HelpSection.TOC]: () => "Table of Contents"
  });
}

interface ToCProps {
  sectionHandle(section: HelpSection): void;
  header: string;
}

export function ToC(props: ToCProps): React.FunctionComponentElement<ToCProps> {

  function butLast<T>(arr: T[]): T[] {
    return arr.filter(i => i !== _.last(arr));
  }

  return (
    <div className="mt-2">
      <h2>{props.header}</h2>
      <ul>
        {butLast($enum(HelpSection).getKeys()).map(section =>
          <li key={section}>
            <a href="#" onClick={() => props.sectionHandle(HelpSection[section])}>{header(HelpSection[section])}</a>
          </li>
        )}
      </ul>
    </div>
  );
}

interface HelpPageProps {
  section: HelpSection;
}

export function HelpPage(props: HelpPageProps): React.FunctionComponentElement<HelpPageProps> {
  const [section, setSection] = React.useState(props.section);

  function renderSection(section: HelpSection): React.ReactElement {
    return matchSwitch(section, {
      [HelpSection.ANNOTATE]: () => <AnnotateHelp header={header(HelpSection.ANNOTATE)}/>,
      [HelpSection.ANNOTATIONS]: () => <AnnotationsHelp header={header(HelpSection.ANNOTATIONS)}/>,
      [HelpSection.SEARCH]: () => <SearchHelp header={header(HelpSection.SEARCH)}/>,
      [HelpSection.PROFILE]: () => <ProfileHelp header={header(HelpSection.PROFILE)}/>,
      [HelpSection.TOC]: () => <ToC sectionHandle={setSection} header={header(HelpSection.TOC)}/>
    });
  }

  function renderTocLink(): React.ReactElement {
    return (
      <div className="row mt-1 pb-2" style={{borderBottom: "1px solid gray"}}>
        <div className="col-sm">
          <a href="#" onClick={() => setSection(HelpSection.TOC)}>Table of Contents</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {section === HelpSection.TOC ? <></> : renderTocLink()}
      <div className="row">
        <div className="col-sm" style={{height: "422px", overflow: "auto"}}>
          {renderSection(section)}
        </div>
      </div>
    </div>
  );
}

export function render(section: HelpSection): void {
  const container = document.getElementById("page");
  if (container) {
    ReactDOM.render(<HelpPage section={section}/>, container);
  } else {
    console.error("#page element missing");
  }
}

