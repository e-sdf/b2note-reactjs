export interface ConfRec {
  widgetServerUrl: string;
  apiServerUrl: string;
  apiPath: string;
  imgPath: string;
  name: string;
  version: string;
  homepage: string;
}

const confRec = (window as any).b2note as ConfRec|undefined;

export const config: ConfRec = {
  widgetServerUrl: confRec?.widgetServerUrl ? confRec.widgetServerUrl : "http://localhost:8080",
  apiServerUrl: confRec?.apiServerUrl ? confRec.apiServerUrl : "http://localhost:3060",
  apiPath: confRec?.apiPath ? confRec.apiPath : "/api",
  imgPath: "/img/",
  name: "B2NOTE",
  version: "v3.7.0",
  homepage: "https://b2note.bsc.es"
};

export const endpointUrl = config.apiServerUrl + config.apiPath;
