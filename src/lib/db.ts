import { MongoClient } from 'mongodb';


const uri : string = import.meta.env.VITE_MONGODB;
const options = {}

let connection : Promise<MongoClient> = null

if(!connection) {
    const client = new MongoClient(uri, options)
    connection = client.connect()    
}

export default connection

// let client;
// let clientPromise;



// if (process.env.NODE_ENV === 'development') {
// 	// In development mode, use a global variable so that the value
// 	// is preserved across module reloads caused by HMR (hot module replacement).
// 	if (!global._mongoClientPromise) {
// 		client = new MongoClient(uri, options);
// 		global._mongoClientPromise = client.connect();
// 	}
// 	clientPromise = global._mongoClientPromise;
// } else {
// 	// In production mode, it's best to not use a global variable.
// 	client = new MongoClient(uri, options);
// 	clientPromise = client.connect();
// }

// export default clientPromise;
