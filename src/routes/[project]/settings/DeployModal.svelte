<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let open: boolean = false;

  let data: any = {};
  const dispatch = createEventDispatcher();

  function deploy() {
    dispatch("deploy", data);
  }
  function cancel() {
    dispatch("cancel");
  }
</script>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Deploy to Vercel</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <El row>
        <Alert>This information will not be stored anywhere</Alert>
        <FormSelect
          cols={3}
          required
          label="DBMS"
          bind:value={data.database_client}
          items={["sqlite3", "pg", "mysql", "TODO"]}
        />
        <FormInput
          cols={9}
          required
          label="Database URI"
          bind:value={data.database_uri}
        />
        <FormInput label="URL in vercel.app" bind:value={data.url} />

        <FormInput label="Your Vercel Token" bind:value={data.vercel_token} />
        <Alert>
          If you provide your vercel token, project will be deployed in your
          account, otherwise project deploys from my vercel account.
        </Alert>
      </El>
    </DialogBody>
    <DialogFooter>
      <ButtonGroup>
        <Button on:click={cancel}>Cancel</Button>
        <Button color="dark" on:click={deploy}>Deploy</Button>
      </ButtonGroup>
    </DialogFooter>
  </DialogContent>
</Dialog>
