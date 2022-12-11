<script lang="ts">
  import api from "$services/api";
  import type { PageData } from "./$types";
  import { createEventDispatcher } from "svelte";
  import ApiKeyEditor from "$components/ApiKeyEditor.svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import { activeProject } from "$stores";
  import DeployModal from "./DeployModal.svelte";

  export let data: PageData;
  data.project.packages = [];
  // data.proejct.urls = [];

  let deployModalOpen = false;

  let newPackageName: string = "";
  let newName = data.project!.name;
  const dispatch = createEventDispatcher();
  async function save() {
    try {
      await api.updateProject(data.project!.name, {
        name: newName,
      });
      data.project!.name = newName;
    } catch (err) {}
  }

  function addNewPackage() {
    data.project.packages = [...data.project.packages, newPackageName];
  }
  function removePackage(pack: string) {
    data.project.packages = data.project.packages.filter((p) => p !== pack);
  }

  async function deploy({ detail }: CustomEvent) {
    if (data.project?.name) {
      const result = await api.deploy({
        name: data.project?.name,
        url: detail.url,
        vercel_token: detail.vercel_token,
        database_client: detail.database_client,
        database_uri: detail.database_uri,
      });
      data.project.urls = result.urls;
    }
  }

  function openDeploy() {
    deployModalOpen = true;
  }

  async function remove() {
    try {
      console.log("PROMPT");
      await api.removeProject(data.project!.name);
      goto("/projects");
    } catch (err) {
      //
    }
  }
</script>

<CardHeader>
  <CardTitle>Settings</CardTitle>
</CardHeader>

<CardBody class="overflow-auto">
  <Row class="g-3">
    <FormInput label="Rename Project" bind:value={newName} />
    <Col>
      <Button on:click={save}>Rename</Button>
    </Col>
    <br />

    <Col>
      <Button on:click={openDeploy} color="dark">
        Deploy Project to Vercel
      </Button>
    </Col>

    <FormField cols={12}>
      <Label>NPM Packages</Label>

      <div class="flex flex-col gap-2">
        {#each data.project.packages ?? [] as pack}
          <div class="flex items-center border border-gray-300 p-2">
            <span class="flex-1">{pack}</span>
            <Button on:click={() => removePackage(pack)}>Remove</Button>
          </div>
        {/each}
      </div>

      <FormInput
        label="name:"
        placeholder="e.g jsonwebtoken, bcrypt, yup, ..."
        bind:value={newPackageName}
      />
      <Button on:click={addNewPackage}>Add</Button>
    </FormField>
  </Row>

  <div class="mt-4 p-2 flex flex-col gap-4 ">
    <div>
      <div class="text-sm mb-2">
        You can copy and paste this link in head section of your html file,
        <br />
        then all functions will be available from
        <code>window.{data.project.name}</code>
        object.
      </div>
      <pre>&lt;script src="{data.url}/{data.project
          .name}/cdn.js"&gt;&lt;script&gt;</pre>
    </div>
    <div>
      <div class="text-sm mb-2">
        if you use a bundler, you can use contents of this file.
      </div>
      <pre>{data.url}/{data.project.name}/mod.js</pre>
    </div>
  </div>

  <div class="p-6 opacity-50">
    <br /> import / export data
  </div>

  <FormField>
    <Label>ApiKeys</Label>
    <ApiKeyEditor />
  </FormField>

  <Button color="danger" on:click={remove}>Remove Project</Button>

  <br />
</CardBody>

<DeployModal
  bind:open={deployModalOpen}
  on:cancel={() => (deployModalOpen = false)}
  on:deploy={deploy}
/>
