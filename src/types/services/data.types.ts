// import type { ProjectData } from "$types";
import type { CollectionRow } from "$types";
import type { Service } from "./service.types";

type ParamsInsertData = {
  project: string;
  collection: string;
  body: CollectionRow | CollectionRow[];
};
type ReturnInsertData = CollectionRow | CollectionRow[];
export type ServiceInsertData = Service<ParamsInsertData, ReturnInsertData>;

type ParamsDeleteData = { id: string; project: string; collection: string };
type ReturnDeleteData = boolean;
export type ServiceDeleteData = Service<ParamsDeleteData, ReturnDeleteData>;

type ParamsEditData = {
  id: string;
  project: string;
  body: CollectionRow;
  collection: string;
};
type ReturnEditData = CollectionRow;
export type ServiceEditData = Service<ParamsEditData, ReturnEditData>;

type ParamsGetData = { collection: string; id: string; project: string };
type ReturnGetData = CollectionRow;
export type ServiceGetData = Service<ParamsGetData, ReturnGetData>;

type ParamsGetRows = { collection: string; project: string };
type ReturnGetRows = CollectionRow[];
export type ServiceGetRows = Service<ParamsGetRows, ReturnGetRows>;
