import { deserialize, Long, serialize } from 'https://deno.land/x/web_bson@v0.2.2/mod.ts';
import * as b64 from 'https://deno.land/std@0.140.0/encoding/base64.ts';

// // Serialize a document
// const doc = { long: new Uint8Array([1, 2, 3, 4, 5]) };
// const data = serialize(doc);
// console.log("data:", data);

// // Deserialize the resulting Buffer
// const doc_2 = deserialize(data);
// console.log("doc_2:", doc_2);
// const doc_3 = b64.decode(doc_2.long.toJSON())
// console.log("doc_3:", doc_3);

import * as M from '../output/deps.ts';
import initializeDB from '../output/database.ts';
import query from '../output/queries.ts';

const client = await initializeDB(M.env.MONGODB_URL);

const newData = new Uint8Array([65, 66, 67]);
console.log({ newData });

// await client.insert('files', {id: 'test3', content: newData})

const files = await client.find('files', { id: 'J3DVvClM0m' });
// const files = await client.find('files', {id: 'test3'})

const content = files[files.length - 1].content;
// const serialized = M.Bson.serialize(content)
// const deserialized = M.Bson.deserialize(serialized)

// console.log("1", deserialized.buffer.length())
// console.log("2", deserialized.buffer.toJSON())
// console.log("3", b64.decode(deserialized.buffer.toJSON()))

// console.log("4", JSON.stringify(deserialized))

console.log({ content });
