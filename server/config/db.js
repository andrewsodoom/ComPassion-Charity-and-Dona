import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const databasePath = path.resolve(__dirname, '..', process.env.DB_PATH || 'data/database.json');
const client = new MongoClient(process.env.MONGODB_URI);
let mongoDatabase;

const collection = name => {
  if (!mongoDatabase) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return mongoDatabase.collection(name);
};

const matches = (document, query) => {
  if (typeof query === 'function') {
    return query(document);
  }

  if (!query || Object.keys(query).length === 0) {
    return true;
  }

  return Object.entries(query).every(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return document[key] !== undefined && document[key] !== null && Object.entries(value).every(([nestedKey, nestedValue]) => document[key]?.[nestedKey] === nestedValue);
    }
    return document[key] === value;
  });
};

const ensureSeedData = async () => {
  const seedData = fs.existsSync(databasePath)
    ? JSON.parse(fs.readFileSync(databasePath, 'utf8'))
    : {};

  const collectionNames = Object.keys(seedData);

  for (const name of collectionNames) {
    const targetCollection = collection(name);
    const count = await targetCollection.countDocuments();
    if (count === 0 && Array.isArray(seedData[name]) && seedData[name].length > 0) {
      await targetCollection.insertMany(seedData[name]);
    }
  }
};

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in server/.env');
  }

  await client.connect();
  mongoDatabase = client.db('blackshepherd');
  await ensureSeedData();

  console.log('✅ MongoDB Atlas connected');
  return mongoDatabase;
};

export const getDB = () => {
  if (!mongoDatabase) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return mongoDatabase;
};

const dbCompatibility = {
  getCollection: async (collectionName) => {
    const targetCollection = collection(collectionName);
    return await targetCollection.find({}).toArray();
  },
  findOne: async (collectionName, query) => {
    const docs = await dbCompatibility.getCollection(collectionName);
    return docs.find(item => matches(item, query)) || null;
  },
  findById: async (collectionName, id) => {
    const docs = await dbCompatibility.getCollection(collectionName);
    return docs.find(item => item.id === id) || null;
  },
  insert: async (collectionName, data) => {
    const targetCollection = collection(collectionName);
    await targetCollection.insertOne(data);
    return data;
  },
  update: async (collectionName, id, data) => {
    const targetCollection = collection(collectionName);
    const result = await targetCollection.updateOne({ id }, { $set: data });
    if (result.matchedCount === 0) return null;
    return { ...(await targetCollection.findOne({ id })), ...data };
  },
  remove: async (collectionName, id) => {
    const targetCollection = collection(collectionName);
    const item = await targetCollection.findOne({ id });
    if (!item) return null;
    await targetCollection.deleteOne({ id });
    return item;
  },
  find: async (collectionName, query) => {
    const docs = await dbCompatibility.getCollection(collectionName);
    return docs.filter(item => matches(item, query));
  },
  count: async (collectionName) => {
    return await collection(collectionName).countDocuments();
  }
};

export default dbCompatibility;