import { openDB } from 'idb';

const DB_NAME = 'expense-tracker-db';
const STORE_NAME = 'sync-queue';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addSyncAction = async (action) => {
  const db = await initDB();
  return db.add(STORE_NAME, {
    ...action,
    timestamp: Date.now(),
  });
};

export const getSyncQueue = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const removeFromQueue = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const clearQueue = async () => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
