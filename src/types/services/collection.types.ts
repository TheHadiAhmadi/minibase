import type { ProjectCollection } from "$types";
import type { Service } from "./service.types";

type ParamsAddCollection = { body: ProjectCollection };
type ReturnAddCollection = ProjectCollection;
export type ServiceAddCollection = Service<
  ParamsAddCollection,
  ReturnAddCollection
>;

type ParamsRemoveCollection = { project: string; name: string };
type ReturnRemoveCollection = boolean;
export type ServiceRemoveCollection = Service<
  ParamsRemoveCollection,
  ReturnRemoveCollection
>;

type ParamsEditCollection = { name: string; body: ProjectCollection };
type ReturnEditCollection = ProjectCollection;
export type ServiceEditCollection = Service<
  ParamsEditCollection,
  ReturnEditCollection
>;

type ParamsGetCollections = { project: string };
type ReturnGetCollections = ProjectCollection[];
export type ServiceGetCollections = Service<
  ParamsGetCollections,
  ReturnGetCollections
>;
