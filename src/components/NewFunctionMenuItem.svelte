<script lang="ts">
  import { addFunction } from "$services/api";
  import { createEventDispatcher } from "svelte";

  import MenuItem from "./MenuItem.svelte";

  let name: string = "";
  export let project: string;
  export let apiKey: string;

  const dispatch = createEventDispatcher();

  async function add() {
    try {
      const code = `// GET method
exports.GET = (request) => {
// return "Hello World!"
// return {
//     this: {
//         is: "JSON Object"
//     }
// }
};

// You need to create a collection named 'users_collection'
// GET method (get data from database)
exports.GET = async (request) => {
    // return {
        // users: await project.db.users.find()
    // }
};


// You need to create a collection named 'users_collection'
// POST method (insert data to database)
exports.POST = async (request) => {
    // const body = await request.json()

    // await project.db.users_colleciton.insert({name: body.name, email: body.email})
    // return {
    //     body: {
    //         success: true
    //     }
    // }
}


// You need to create a collection named 'users_collection'
// PUT method (Change data)
exports.PUT = async (request) => {
    // const id = new URL(request.url).searchParams.get('id')
    // const body = await request.json()

    // await project.db.users_colleciton.update(id, {name: body.name, email: body.email})
    // return {
    //     body: {
    //         success: true
    //     }
    // }
}


// You need to create a collection named 'users_collection'
// DELETE method (remove data)
exports.DELETE = async (request) => {
    // const id = new URL(request.url).searchParams.get('id')
    
    // await project.db.users_colleciton.remove(id)
    // return {
    //     body: {
    //         success: true
    //     }
    // }
}
`;

      const fn = await addFunction({ name, project, code }, apiKey);
      dispatch("add", fn);
      name = "";
    } catch (err) {}
  }

  function cancel() {
    dispatch("cancel");
  }
</script>
