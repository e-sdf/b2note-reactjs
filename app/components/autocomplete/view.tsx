import _ from "lodash";
import * as React from "react";
import { OntologyInfo, OntologyDict, getOntologies } from "../../core/ontologyRegister";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

export interface Suggestion {
  label: string;
  labelOrig: string;
  items: Array<OntologyInfo>;
}

function mkSuggestion(item: OntologyInfo): Suggestion {
  return {
    label: item.labels + " (" + item.ontologyAcronym + " " + item.shortForm + ")",
    labelOrig: item.labels,
    items: [item]
  };
}

function aggregateGroup(group: Array<OntologyInfo>): Suggestion {
  return {
    label: group[0].labels + " (" + group.length + ")",
    labelOrig: group[0].labels,
    items: group 
  };
}

function mkSuggestions(oDict: OntologyDict): Array<Suggestion> {
  const res: Array<Suggestion> = _.keys(oDict).map(oKey => {
    const og = oDict[oKey];
    return og.length > 1 ? aggregateGroup(og) : mkSuggestion(og[0]);
  });
  //console.log(res);
  return res;
}


interface Props {
  id?: string;
  defaultInputValue?: string;
  onChange: (val: Array<Suggestion>) => void;
}

interface State {
  loading: boolean;
  options: Array<Suggestion>;
}

export class SemanticAutocomplete extends React.Component<Props, State> {

  private typeahead: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      options: []
    };
  }

  public clear = () => {
    const ta = this.typeahead;
    if (ta) {
      ta.getInstance().clear();
    }
  }

  public focus = () => {
    const ta = this.typeahead;
    if (ta) {
      ta.getInstance().focus();
    }
  }

  public render = () => {
    return (
      <AsyncTypeahead
        id={this.props.id}
        ref={(typeahead) => this.typeahead = typeahead}
        defaultInputValue={this.props.defaultInputValue}
        allowNew={true}
        isLoading={this.state.loading}
        onSearch={query => {
          this.setState({ loading: true });
          getOntologies(query)
          .then((ontologiesDict) => {
            this.setState({ 
              loading: false,
              options: mkSuggestions(ontologiesDict)
            });
          });
        }}
        onChange={this.props.onChange}
        options={this.state.options}
      />
    );
  }
}



