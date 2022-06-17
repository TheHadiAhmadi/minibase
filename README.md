# minibase - minimal clone of firebase

in this project I want to recreate some basic features of firebase using sveltekit

## features

- you can create unlimited public and private app/database and tables
- manage data from easy to use dashboard
- CRUD operation for all tables using JSON api

## todo

- Authentication using JWT tokens
- cache data in backend
- realtime events with WebSocket
- client side and server side SDKs
- reports and logging for dashboard
- write self hosting guide
- maybe graphql support
- vscode extension
- and many more....

## usage

> YOU SHOULD ONLY USE FOR TESTING AND SMALL PROJECTS

you can use rest api to access/modify data of your tables.

here is link to dashboard: https://minibase.deno.dev

for exaxmple you can use this url to get list of users as JSON https://minibase.deno.dev/jsonplaceholder/users.json.
for modifying data or accessing private data you need to provide ApiKey header like below example:

```js
fetch('https://minibase.deno.dev/jsonplaceholder/users/2', {
  method: 'PUT',
  headers: {
    'Content-Type': "application/json",
    'apiKey': '5b9aJUtwTwDMmx9HPRokHSaT-hkycENs' // you can get apiKey of your app from settings tab in dashboard
  },
  body: JSON.stringify({
    name: 'Changed Name'
  })
}

```
<!-- 
# routes

https://minibase.deno.dev

| method | route                        | description                                |
| ------ | ---------------------------- | ------------------------------------------ |
| GET    | /api/:appName                | returns list of tables                     |
| GET    | /api/:appName/:tableName     | return data of table                       |
| GET    | /api/:appName/:tableName/:id | get single item                            |
| POST   | /api/:appName                | add new table for app (name, rows, public) |
| PUT    | /api/:appName/:tableName     | update table info (name?, rows?, public?)  |
| DELETE | /api/:appName/:tableName     | remove table with it's data                |
| POST   | /api/:appName/:tableName     | insert data in table (any object)          |
| PUT    | /api/:appName/:tableName/:id | update data with this id (any object)      |
| DELETE | /api/:appName/:tableName/:id | remove single item from table              |
 -->
# contribution

contributions are welcome, you can create issue/PR for bugs or new features

# licence

MIT


## Developing 
after you cloned this repository, you need to run 
```bash
npm install
```

then to start development server run:
```bash
npm run dev
```

## Building
to build this project, you should run:
```bash
npm run build
```
