export interface Template {
  id: string;
  // Template Info
  templateName: string;
  templateCode: string;
  templateTags: string[];
  version: string;
  lastUpdateDetails: string;
  typeOfTemplate: string;
  status: "draft" | "active" | "inactive";
  // General Details — Device
  brandName: string;
  modelNo: string;
  iconLogo: string;
  gatewayDetails: string;
  gatewayModelNo: string;
  projectCode: string;
  description: string;
  coverPage?: string;
  graphicalCanvas?: string;
  // Meta
  activationDate: string;
  globalStatus: "request_for_global" | "global_live" | "local_only";
  source: "local" | "global";
}
