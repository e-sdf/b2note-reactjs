import * as anModel from "../core/annotationsModel";
import fileDownload from "js-file-download"; 
import { mkRDF } from "../core/rdf";

function mkFilename(format: anModel.Format): string {
  return "annotations_" + anModel.mkTimestamp() + "." + anModel.mkFileExt(format);
}

export function downloadJSON(anRecords: anModel.AnRecord[]): void {
  fileDownload(JSON.stringify(anRecords, null, 2), mkFilename(anModel.Format.JSONLD));
}

export function downloadRDF(anRecords: anModel.AnRecord[]): void {
  const rdf = mkRDF(anRecords);
  fileDownload(rdf, mkFilename(anModel.Format.RDF));
}
