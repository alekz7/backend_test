const { MongoClient } = require("mongodb");

/**
 * Database connection manager (singleton)
 *
 * Features:
 * - lazy connect with optional retries and delay
 * - single in-flight connect() promise to avoid duplicate connections
 * - small explicit API: connect, get (backwards-compatible), getClient, getDb, isConnected, close
 * - supports callback style connect(cb) for compatibility with older code
 */

let client = null; // MongoClient instance
let connectingPromise = null; // promise while a connection is in-flight

/**
 * Try to connect to MongoDB using uri from process.env.MONGODB_URI.
 * Options controlled via environment variables:
 * - MONGODB_URI (required)
 * - MONGODB_DBNAME (optional default 'test')
 * - DB_CONNECT_RETRIES (optional default 3)
 * - DB_CONNECT_RETRY_DELAY (ms) (optional default 1000)
 *
 * @param {Function} [cb] optional callback(err) for compatibility
 * @returns {Promise<void>} resolves when connected
 */
async function connect(cb) {
  // callback compatibility
  const callback = typeof cb === "function" ? cb : null;

  // if already connected, immediately return
  if (
    client &&
    client.topology &&
    client.topology.isConnected &&
    client.topology.isConnected()
  ) {
    if (callback) return callback();
    return;
  }

  // if a connect is already happening, return the same promise
  if (connectingPromise) {
    try {
      await connectingPromise;
      if (callback) return callback();
      return;
    } catch (err) {
      if (callback) return callback(err);
      throw err;
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error("MONGODB_URI is not defined in environment");
    if (callback) return callback(err);
    throw err;
  }

  const retries = Number(process.env.DB_CONNECT_RETRIES || 3);
  const retryDelay = Number(process.env.DB_CONNECT_RETRY_DELAY || 1000);

  // attempt connection with retries
  connectingPromise = (async () => {
    let lastErr;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // create a new client each attempt to avoid reusing a broken instance
        client = new MongoClient(uri);
        await client.connect();
        // connected successfully
        return;
      } catch (err) {
        lastErr = err;
        // clean up client before retrying
        try {
          if (client) await client.close();
        } catch (_) {}
        client = null;
        if (attempt < retries) {
          // simple backoff
          await new Promise((res) => setTimeout(res, retryDelay * attempt));
        }
      }
    }
    // all attempts failed
    throw lastErr;
  })();

  try {
    await connectingPromise;
    connectingPromise = null;
    if (callback) return callback();
    return;
  } catch (err) {
    connectingPromise = null;
    if (callback) return callback(err);
    throw err;
  }
}

/**
 * Backwards-compatible getter used by existing code. Returns the MongoClient instance.
 * If you prefer a clearer API, use getClient() / getDb() instead.
 * @returns {MongoClient|null}
 */
function get() {
  return client;
}

/**
 * Returns the raw MongoClient instance.
 */
function getClient() {
  return client;
}

/**
 * Return a Db instance for the provided database name or the default one.
 * @param {string} [dbName] database name (falls back to process.env.MONGODB_DBNAME or 'test')
 */
function getDb(dbName) {
  if (!client) return null;
  const name = dbName || process.env.MONGODB_DBNAME || "test";
  return client.db(name);
}

/**
 * Indicates whether the client is connected.
 */
function isConnected() {
  try {
    return !!(
      client &&
      client.topology &&
      client.topology.isConnected &&
      client.topology.isConnected()
    );
  } catch (e) {
    return false;
  }
}

/**
 * Close the client and clear internal state.
 * @returns {Promise<void>|undefined}
 */
async function close() {
  if (connectingPromise) {
    // wait for any in-flight connect to finish before closing
    try {
      await connectingPromise;
    } catch (_) {}
    connectingPromise = null;
  }
  if (client) {
    try {
      await client.close();
    } finally {
      client = null;
    }
  }
}

module.exports = {
  connect,
  // keep legacy names for compatibility
  get,
  close,
  // clearer helpers
  getClient,
  getDb,
  isConnected,
};
