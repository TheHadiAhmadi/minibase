import { alertMessage } from "$stores/alert";
import type {
  ApiKey,
  ApiKeyScopes,
  CollectionInfo,
  CollectionRow,
  Project,
  ProjectCollection,
  ProjectFunction,
  ProjectInfo,
} from "src/types";

function showError(err: App.Error) {
  console.log(err);
  alertMessage.showError(`(${err.status}) - ${err.message}`);
}

export async function getProjects() {
  const result = await fetch("/api")
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data as Project[];
}

export async function getProject(name: string, fetcher: typeof fetch = fetch) {
  const result = await fetcher(`/api/${name}`)
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return {
    project: result.data as ProjectInfo,
    scopes: result.scopes as ApiKeyScopes[],
  };
}

export async function createProject(name: string) {
  const result = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function updateProject(id: string, request: Partial<ProjectInfo>) {
  const result = await fetch(`/api/${id}`, {
    method: "POST",
    body: JSON.stringify(request),
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function removeProject(id: string) {
  const result = await fetch(`/api/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return true;
}

export async function addApiKey(project: string, body: ApiKey) {
  const result = await fetch(`/api/${project}/apikeys`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function getRows({
  project,
  name,
}: {
  project: string;
  name: string;
}): Promise<CollectionRow[]> {
  const result = await fetch(`/api/${project}/collections/${name}`).then(
    (res) => res.json()
  );

  return result.data as CollectionRow[];
}

export async function insertData(
  project: string,
  collection: string,
  request: CollectionRow
) {
  const result = await fetch(`/api/${project}/collections/${collection}`, {
    method: "POST",
    body: JSON.stringify(request),
  }).then((res) => res.json());
  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function editData(
  project: string,
  collection: string,
  id: string,
  request: CollectionRow
) {
  const result = await fetch(
    `/api/${project}/collections/${collection}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    }
  ).then((res) => res.json());
  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function deleteData(
  project: string,
  collection: string,
  id: string
) {
  const result = await fetch(
    `/api/${project}/collections/${collection}/${id}`,
    {
      method: "DELETE",
    }
  ).then((res) => res.json());
  if (result.status >= 400) {
    showError(result);
    throw result;
  }
  return result.data;
}

export async function addCollection(request: ProjectCollection) {
  const result = await fetch(`/api/${request.project}/collections`, {
    method: "POST",
    body: JSON.stringify(request),
  })
    .then((res) => res.json())
    .catch(showError);

  console.log("addCollection", result);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function editCollection(name: string, request: ProjectCollection) {
  // TODO
  const result = await fetch(`/api/${request.project}/collections/${name}`, {
    method: "PUT",
    body: JSON.stringify(request),
  }).then((res) => res.json());

  if (result.status >= 400) {
    showError(result);
    throw result;
  }
  return result.data;
}

export async function removeCollection(project: string, name: string) {
  // TODO
  const result = await fetch(`/api/${project}/collections/${name}`, {
    method: "DELETE",
  }).then((res) => res.json());

  if (result.status >= 400) {
    showError(result);
    throw result;
  }
  return true;
}

export async function addFunction({
  name,
  code,
  routes,
  project,
}: ProjectFunction): Promise<ProjectFunction> {
  const result = await fetch(`/api/${project}/functions`, {
    method: "POST",
    body: JSON.stringify({ name, code, routes }),
  })
    .then((res) => res.json())
    .catch(showError);

  console.log("api add function", { result });

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data as ProjectFunction;
}

export async function getFunctions(project: string): Promise<ProjectFunction> {
  const result = await fetch(`/api/${project}/functions`)
    .then((res) => res.json())
    .catch(showError);
  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data as ProjectFunction;
}

export async function editFunction(
  id: string,
  data: ProjectFunction
): Promise<ProjectFunction> {
  const result = await fetch(`/api/${data.project}/functions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function removeFunction(
  project: string,
  id: string
): Promise<boolean> {
  const result = await fetch(`/api/${project}/functions/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}

export async function removeApiKey(
  project: string,
  id: string
): Promise<boolean> {
  const result = await fetch(`/api/${project}/apikeys/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch(showError);

  if (result.status >= 400) {
    showError(result);
    throw result;
  }

  return result.data;
}
