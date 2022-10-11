import { ApiKey, ApiKeyScopes } from "..";
import type { Service } from "./service.types";

type ParamsAddApiKey = {
  project: string;
  body: ApiKey;
};
type ReturnAddApiKey = ApiKey;
export type ServiceAddApiKey = Service<ParamsAddApiKey, ReturnAddApiKey>;

type ParamsUpdateApiKey = {
  project: string;
  id: string;
  body: ApiKey;
};
type ReturnUpdateApiKey = ApiKey;
export type ServiceUpdateApiKey = Service<
  ParamsUpdateApiKey,
  ReturnUpdateApiKey
>;

type ParamsGetApiKey = {
  project: string;
  value: string;
};
type ReturnGetApiKey = ApiKey;
export type ServiceGetApiKey = Service<ParamsGetApiKey, ReturnGetApiKey>;

type ParamsGetApiKeys = {
  project: string;
};
type ReturnGetApiKeys = ApiKey[];
export type ServiceGetApiKeys = Service<ParamsGetApiKeys, ReturnGetApiKeys>;

type ParamsRemoveApiKey = {
  project: string;
  id: string;
};
type ReturnRemoveApiKey = boolean;
export type ServiceRemoveApiKey = Service<
  ParamsRemoveApiKey,
  ReturnRemoveApiKey
>;
