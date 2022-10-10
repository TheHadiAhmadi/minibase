import type { ProjectCollection, ProjectFunction } from "$types";

type Service<Params, ReturnType> = (request: Params) => Promise<ReturnType>;


type ParamsGetFunctions = { project: string };
type ReturnGetFunctions = ProjectFunction[];
export type ServiceGetFunctions = Service<
  ParamsGetFunctions,
  ReturnGetFunctions
>;

type ParamsEditFunction = { id: string; request: ProjectFunction };
type ReturnEditFunction = ProjectFunction;
export type ServiceEditFunction = Service<
  ParamsEditFunction,
  ReturnEditFunction
>;

type ParamsRemoveFunction = { id: string };
type ReturnRemoveFunction = boolean;
export type ServiceRemoveFunction = Service<
  ParamsRemoveFunction,
  ReturnRemoveFunction
>;
