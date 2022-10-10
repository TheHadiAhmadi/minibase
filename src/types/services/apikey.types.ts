import { ApiKey, ApiKeyScopes } from "..";
import type { Service } from "./service.types";

type ParamsAddApiKey = {
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

type ParamsValidateApiKey = {
  project: string;
  value: string;
  scpoes: ApiKeyScopes[];
};
type ReturnValidateApiKey = boolean;
export type ServiceValidateApiKey = Service<
  ParamsValidateApiKey,
  ReturnValidateApiKey
>;

type ParamsRemoveApiKey = {
  project: string;
  value: string;
};
type ReturnRemoveApiKey = boolean;
export type ServiceRemoveApiKey = Service<
  ParamsRemoveApiKey,
  ReturnRemoveApiKey
>;