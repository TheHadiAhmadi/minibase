export const APIKEY_SCOPES = {
  READ_FUNCTION: "read:function",
  WRITE_FUNCTION: "write:function",
  READ_DATA: "read:data",
  WRITE_DATA: "write:data",
  READ_ENV: "read:env",
  WRITE_ENV: "write:env",
  PROJECT_ADMIN: "admin:project",
} as const;

export type ApiKeyScopes = typeof APIKEY_SCOPES[keyof typeof APIKEY_SCOPES];

export type ApiKey = {
  id?: string;
  name: string;
  project?: string;
  value?: string;
  scopes: ApiKeyScopes[];
};

export type Project = {
  name: string;
  env?: Record<string, string>;
  id?: string;
  apiKeys?: ApiKey[];
};
export type ProjectInfo = Project & {
  functions?: ProjectFunction[];
  collections?: ProjectCollection[];
};
export type ProjectInfoPromise = Project & {
  functions: Promise<ProjectFunction[]>;
  collections: Promise<ProjectCollection[]>;
};

export type DataType = "string" | "boolean" | "number" | "object" | "array";
export type CollectionSchema = { name: string; type: DataType };

export type ProjectCollection = {
  name: string;
  project: string;
  id?: string;
  schema: CollectionSchema[];
};

export type CollectionRow = {
  id: string;
  [x: string]: string | number | boolean | object | any[];
};
export type CollectionInfo = ProjectCollection & { rows: CollectionRow[] };

export type ProjectFunction = {
  project: string;
  name: string;
  code: string;
  routes: string[];
  method: "GET" | "PUT" | "POST" | "DELETE";
  id?: string;
};

export type ResponseError = Error & { status: number };
