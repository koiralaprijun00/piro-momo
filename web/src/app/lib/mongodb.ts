// src/app/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Use the correct MongoDB connection string with proper encoding
const MONGODB_URI = process.env.MONGODB_URI || '';

// Global MongoDB client reference
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

// Connection options with specific TLS/SSL settings to fix the connection issues
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,  // This can help bypass SSL issues in some cases
  tlsAllowInvalidHostnames: true,     // This helps with hostname verification issues
  retryWrites: false,                 // Disable retry writes which might be causing issues
  retryReads: false                   // Disable retry reads for the same reason
};

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    (global as any)._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('MongoDB connection error in development:', err);
        throw err;
      });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect()
    .catch(err => {
      console.error('MongoDB connection error in production:', err);
      throw err;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;