import { alertMessage } from "$stores/alert";
import type {
  ApiKey,
  ApiKeyScopes,
  CollectionRow,
  Project,
  ProjectCollection,
  ProjectFunction,
  ProjectInfo,
} from "$types";

function showError(err: App.Error) {
  console.log(err);
  alertMessage.showError(`(${err.status}) - ${err.message}`);
}

const api = () => {
  async function send<T>(
    url: string,
    method = "GET",
    data: object | null = null
  ): Promise<T> {
    try {
      const opts: RequestInit = {};

      if (method !== "GET") {
        opts.method = method;
      }
      opts.headers = new Headers();

      if (data != null) {
        opts.headers.set("Content-Type", "application/json");

        opts.body = JSON.stringify(data);
      }

      const result = await fetch(url, opts).then((res) => res.json());

      if (result.status >= 400)
        throw new Error(`${result.status} - ${result.message}`);

      return result.data;
    } catch (err: any) {
      showError(err);
      throw err;
    }
  }

  return {
    getProjects: () => send<Project[]>("/api"),

    getProject: (name: string) =>
      send<{ project: ProjectInfo; scopes: ApiKeyScopes[] }>(`/api/${name}`),

    createProject: (name: string) =>
      send<ProjectInfo>("/api", "POST", { name }),

    updateProject: (id: string, request: Partial<Project>) =>
      send<Project>(`/api/${id}`, "POST", request),

    removeProject: (id: string) => send<boolean>(`/api/${id}`, "DELETE"),

    addApiKey: (project: string, request: ApiKey) =>
      send<ApiKey>(`/api/${project}/apikeys`, "POST", request),

    getRows: (project: string, collection: string) =>
      send<CollectionRow[]>(`/api/${project}/collections/${collection}`),

    insertData: (project: string, collection: string, request: CollectionRow) =>
      send<CollectionRow>(
        `/api/${project}/collections/${collection}`,
        "POST",
        request
      ),

    editData: (
      project: string,
      collection: string,
      id: string,
      request: CollectionRow
    ) =>
      send<CollectionRow>(
        `/api/${project}/collections/${collection}/${id}`,
        "PUT",
        request
      ),

    removeData: (project: string, collection: string, id: string) =>
      send<boolean>(
        `/api/${project}/collections/${collection}/${id}`,
        "DELETE"
      ),

    addCollection: (project: string, request: ProjectCollection) =>
      send<ProjectCollection>(`/api/${project}/collections`, "POST", request),

    editCollection: (
      project: string,
      collection: string,
      request: ProjectCollection
    ) =>
      send<ProjectCollection>(
        `/api/${project}/collections/${collection}`,
        "PUT",
        request
      ),

    removeCollection: (project: string, collection: string) =>
      send<boolean>(`/api/${project}/collections/${collection}`, "DELETE"),

    addFunction: (project: string, request: ProjectFunction) =>
      send<ProjectFunction>(`/api/${project}/functions`, "POST", request),

    getFunctions: (project: string) =>
      send<ProjectFunction>(`/api/${project}/functions`),

    editFunction: (project: string, id: string, request: ProjectFunction) =>
      send<ProjectFunction>(`/api/${project}/functions/${id}`, "PUT", request),

    removeFunction: (project: string, id: string) =>
      send<boolean>(`/api/${project}/functions/${id}`, "DELETE"),

    removeApiKey: (project: string, id: string) =>
      send<boolean>(`/api/${project}/apikeys/${id}`, "DELETE"),
    setCookie: (name: string, value: string) =>
      send<boolean>("/api/set-cookie", "POST", { name, value }),
  };
};
export default api();
