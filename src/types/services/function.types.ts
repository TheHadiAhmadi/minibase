import type { ProjectFunction } from "$types";
import type { Service } from "./service.types";

type ParamsAddFunction = { body: ProjectFunction; project: string };
type ReturnAddFunction = ProjectFunction;
export type ServiceAddFunction = Service<ParamsAddFunction, ReturnAddFunction>;

type ParamsGetFunctions = { project: string };
type ReturnGetFunctions = ProjectFunction[];
export type ServiceGetFunctions = Service<
  ParamsGetFunctions,
  ReturnGetFunctions
>;

type ParamsEditFunction = { id: string; body: ProjectFunction };
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
