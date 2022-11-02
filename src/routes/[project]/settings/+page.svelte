<script lang="ts">
  import api from "$services/api";
  import type { PageData } from "./$types";
  import { createEventDispatcher } from "svelte";
  import ApiKeyEditor from "$components/ApiKeyEditor.svelte";
  import { goto, invalidateAll } from "$app/navigation";

  export let data: PageData;

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

<CardBody>
  <FormInput label="Rename Project" bind:value={newName} />
  <Button on:click={save}>Rename</Button>

  <div class="mt-4 p-2 flex flex-col gap-4 ">
    <div>
      <div class="text-sm mb-2">
        You can copy and paste this link in head section of your html file,
        <br />
        then all functions will be available from
        <code>window.{data.project.name}</code>
        object.
      </div>
      <pre>&lt;script src="https://theminibase.com/{data.project
          .name}/cdn.js"&gt;&lt;script&gt;</pre>
    </div>
    <div>
      <div class="text-sm mb-2">
        if you use a bundler, you can use contents of this file.
      </div>
      <pre>https://theminibase.com/{data.project.name}/mod.js</pre>
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
