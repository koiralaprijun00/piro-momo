// src/app/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000,
  ssl: true,
  tls: true,
  retryWrites: false,
  retryReads: false,
};

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoClient?: MongoClient;
};

const globalWithMongo = globalThis as GlobalWithMongo;

export const getMongoClient = (): Promise<MongoClient> => {
  if (globalWithMongo._mongoClient) {
    return Promise.resolve(globalWithMongo._mongoClient);
  }

  if (!globalWithMongo._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then((connectedClient) => {
      globalWithMongo._mongoClient = connectedClient;
      return connectedClient;
    });
  }

  if (!globalWithMongo._mongoClientPromise) {
    throw new Error('MongoClient promise is not initialized');
  }

  return globalWithMongo._mongoClientPromise;
};

export default getMongoClient;
