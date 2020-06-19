import { matchSwitch } from "@babakness/exhaustive-type-checking";
import * as React from "react";
import * as anModel from "../core/annotationsModel";
import { AuthUser } from "../context";
import { shorten } from "../components/utils";
import { SemanticIcon, KeywordIcon, CommentIcon } from "./icons";

interface AnnotationProps {
  annotation: anModel.Annotation;
  mbUser: AuthUser|null;
  maxLen?: number;
  onClick?: () => void;
}

export default function AnnotationTag(props: AnnotationProps): React.FunctionComponentElement<AnnotationProps> {
  const annotation = props.annotation;
  const label = anModel.getLabel(annotation);

  const icon = matchSwitch(anModel.getAnType(annotation), {
    [anModel.AnnotationType.SEMANTIC]: () => <SemanticIcon className="text-secondary" />,
    [anModel.AnnotationType.KEYWORD]: () => <KeywordIcon className="text-secondary" />,
    [anModel.AnnotationType.COMMENT]: () => <CommentIcon className="text-secondary" />,
  });
  const itemStyle = 
    props.mbUser ? 
      props.mbUser.profile.id === anModel.getCreatorId(annotation) ? {} : { fontStyle: "italic" }
    : { fontStyle: "italic" }; 

  function renderSemanticLabel(): React.ReactElement {
    const shortened = props.maxLen ? shorten(label, props.maxLen - 4) : label;
    const ontologiesNo = anModel.getSources(annotation).length;
    return (
      <a
        href="#"
        style={itemStyle}
        data-toggle="tooltip"
        data-placement="bottom"
        title={`${label} (present in ${ontologiesNo} ${
          ontologiesNo > 1 ? "ontologies" : "ontology"
        })`}
        onClick={props.onClick ? props.onClick : () => void(0)}
      >
        {`${shortened} (${ontologiesNo})`}
      </a>
    );
  }

  function renderOtherLabel(): React.ReactElement {
    const shortened = props.maxLen ? shorten(label, props.maxLen) : label;
    return (
      <span
        style={itemStyle}
        data-toggle="tooltip"
        data-placement="bottom"
        title={label}
      >
        {shortened}
      </span>
    );
  }

  return (
    <div>
      {icon}
      <span> </span>
      {anModel.isSemantic(annotation)
        ? renderSemanticLabel()
        : renderOtherLabel()}
    </div>
  );
}
