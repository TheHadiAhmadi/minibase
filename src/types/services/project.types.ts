// import type { ProjectData } from "$types";
import type { CollectionRow, Project, ProjectInfoPromise } from "$types";
import type { Service } from "./service.types";

type ParamsAddProject = {
  body: Project;
};
type ReturnAddProject = Project;
export type ServiceAddProject = Service<ParamsAddProject, ReturnAddProject>;

type ParamsUpdateProject = {
  name: string;
  body: Project;
};
type ReturnUpdateProject = Partial<Project>;
export type ServiceUpdateProject = Service<
  ParamsUpdateProject,
  ReturnUpdateProject
>;

type ParamsGetPorject = { name: string };
type ReturnGetPorject = ProjectInfoPromise;
export type ServiceGetPorject = Service<ParamsGetPorject, ReturnGetPorject>;

type ParamsGetAllProjects = {};
type ReturnGetAllProjects = Project[];
export type ServiceGetAllProjects = Service<
  ParamsGetAllProjects,
  ReturnGetAllProjects
>;

type ParamsRemoveProject = {
  name: string;
};
type ReturnRemoveProject = boolean;
export type ServiceRemoveProject = Service<
  ParamsRemoveProject,
  ReturnRemoveProject
>;
