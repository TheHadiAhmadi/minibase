export type Project = {
  name: string;
  env: Record<string, string>;
  id?: string;
  apiKey?: string;
};
export type ProjectInfo = Project & {
  functions: ProjectFunction[];
  collections: ProjectCollection[];
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
  id: string,
  [x: string]: string | number | boolean | object | any[];
};
export type CollectionInfo = ProjectCollection & { rows: CollectionRow[] };

export type ProjectFunction = {
  project: string;
  name: string;
  code: string;
  id?: string;
};

export type ResponseError = Error & { status: number };
