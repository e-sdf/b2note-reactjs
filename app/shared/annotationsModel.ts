// Endpoints {{{1

export const annotationsUrl = "/annotations";
export const filesUrl = "/files";

// Types {{{1

export interface Target {
  pid: string;
  source: string;
}

export enum AnBodyItemType {
  COMPOSITE = "Composite",
  SPECIFIC_RESOURCE = "SpecificResource",
  TEXTUAL_BODY = "TextualBody"
}

export interface AnBodyItemSpecific {
  type: AnBodyItemType.SPECIFIC_RESOURCE;
  source: string;
}

export function mkAnBodyItemSpecific(source: string): AnBodyItemSpecific {
  return {
    type: AnBodyItemType.SPECIFIC_RESOURCE,
    source
  };
}

export interface AnBodyItemTextual {
  type: AnBodyItemType.TEXTUAL_BODY;
  value: string;
}

export function mkAnBodyItemTextual(value: string): AnBodyItemTextual {
  return {
    type: AnBodyItemType.TEXTUAL_BODY,
    value
  };
}

export type AnBodyItem = AnBodyItemSpecific | AnBodyItemTextual;

export enum PurposeType {
  TAGGING = "tagging",
  COMMENTING = "commenting"
}

export interface AnCompositeBody {
  type: AnBodyItemType.COMPOSITE;
  items: Array<AnBodyItem>;
  purpose: PurposeType.TAGGING;
}

export function mkCompositeBody(specificItems: Array<AnBodyItemSpecific>, textualItem: AnBodyItemTextual): AnCompositeBody {
  return {
    type: AnBodyItemType.COMPOSITE,
    items: [...specificItems, textualItem],
    purpose: PurposeType.TAGGING
  };
}

export interface AnTextualBody {
  type: AnBodyItemType.TEXTUAL_BODY;
  value: string;
  purpose: PurposeType;
}

export function mkTextualBody(value: string, purpose: PurposeType): AnTextualBody {
  return {
    type: AnBodyItemType.TEXTUAL_BODY,
    value,
    purpose
  };
}

export type AnBody = AnCompositeBody | AnTextualBody;

export interface AnCreator {
  id: string;
  type: string;
  nickname: string;
}

export function mkCreator(obj: {id: string; nickname: string}): AnCreator {
  return { ...obj, type: "Person" };
}

export interface AnGenerator {
  type: string;
  homepage: string;
  name: string;
}

export function mkGenerator(): AnGenerator {
  return {
    type: "Software",
    homepage: "https://b2note.bsc.es/b2note/",
    name: "B2Note v3.0"
  };
}

export interface AnTarget {
  id: string;
  source: string;
  type: string;
}

export function mkTarget(obj: {id: string; source: string}): AnTarget {
  return { ...obj, type: AnBodyItemType.SPECIFIC_RESOURCE }; 
}

export interface AnRecord {
  "@context": string;
  body: AnBody;
  created: string;
  creator: AnCreator;
  generated: string;
  generator: AnGenerator;
  id: string;
  motivation: PurposeType;
  target: AnTarget;
  type: string;
}


export function mkSemanticAnBody(sources: Array<string>, value: string): AnCompositeBody {
  const specificItems = sources.map(source => mkAnBodyItemSpecific(source));
  const textualItem = mkAnBodyItemTextual(value);
  return mkCompositeBody(specificItems, textualItem);
}

export function mkKeywordAnBody(value: string): AnTextualBody {
  return mkTextualBody(value, PurposeType.TAGGING);
}

export function mkCommentAnBody(value: string): AnTextualBody {
  return mkTextualBody(value, PurposeType.COMMENTING);
}

export function mkAnRecord(body: AnBody, target: AnTarget, creator: AnCreator, generator: AnGenerator, motivation: PurposeType): AnRecord {
  const ts = mkTimestamp();
  return {
    "@context": "http://www.w3.org/ns/anno/jsonld",
    body,
    target,
    created: ts,
    creator,
    generated: ts,
    generator,
    id: "",
    motivation,
    type: "Annotation"
  };
}

// Record Creation {{{1

export function mkTimestamp(): string {
  return (new Date()).toISOString();
}

// Requests parameters {{{1

export enum TypeFilter {
  SEMANTIC = "semantic",
  KEYWORD = "keyword",
  COMMENT = "comment"
}

export interface GetQuery {
  type?: Array<TypeFilter>;
  creator?: string;
  "target-source"?: string;
  value?: string;
  expression?: string;
}

export interface FilesQuery {
  tag: string;
}

// Querying {{{1

export function isSemantic(anRecord: AnRecord): boolean {
  return anRecord.body.type === AnBodyItemType.COMPOSITE;
}

export function isKeyword(anRecord: AnRecord): boolean {
  return anRecord.motivation === PurposeType.TAGGING && anRecord.body.type === AnBodyItemType.TEXTUAL_BODY;
}

export function isComment(anRecord: AnRecord): boolean {
  return anRecord.motivation === PurposeType.COMMENTING && anRecord.body.type === AnBodyItemType.TEXTUAL_BODY;
}

export function getLabel(anRecord: AnRecord): string {
  if (isSemantic(anRecord)) {
    const anBody = anRecord.body as AnCompositeBody;
    const item = anBody.items.find((i: AnBodyItem) => i.type === AnBodyItemType.TEXTUAL_BODY ) as AnBodyItemTextual;
    if (!item) {
      throw new Error("TextualBody record not found in body item");
    } else {
      if (!item.value) {
        throw new Error("Value field not found in TextualBody item");
      } else {
        return item.value;
      }
    }
  } else {
    const anBody = anRecord.body as AnTextualBody;
    return anBody.value;
  }
}

export function getSources(anRecord: AnRecord): Array<string> {
  if (isSemantic(anRecord)) {
    const anBody = anRecord.body as AnCompositeBody;
    const specificItems = anBody.items.filter((i: AnBodyItem) => i.type === AnBodyItemType.SPECIFIC_RESOURCE) as Array<AnBodyItemSpecific>;
    return specificItems.map(i => i.source);
  } else {
    return [];
  }
}

