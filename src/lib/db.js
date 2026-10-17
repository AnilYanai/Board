// In-Memory Database Adapter (Modular / Swappable)
// This in-memory store persists across hot-reloads in Node.js global scope.
// When you switch to PostgreSQL, Prisma, or Supabase later,
// you only need to change the implementation inside these functions!

const globalForDb = globalThis;

if (!globalForDb.boardMemoryDb) {
  globalForDb.boardMemoryDb = {
    users: [
      {
        id: "user_demo",
        name: "Demo Artist",
        email: "demo@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ],
    sessions: new Map(), // sessionToken -> userId
    boards: [],
  };
}

const memoryDb = globalForDb.boardMemoryDb;

export const db = {
  // Find a user by email address
  findUserByEmail: async (email) => {
    if (!email) return null;
    const user = memoryDb.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    return user ? { ...user } : null;
  },

  // Find a user by unique ID
  findUserById: async (id) => {
    const user = memoryDb.users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // Create a new user
  createUser: async ({ name, email, password }) => {
    const newUser = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // In future PostgreSQL migration, hash with bcrypt/argon2
      createdAt: new Date().toISOString(),
    };
    memoryDb.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  // Create an authentication session token
  createSession: async (userId) => {
    const token =
      "sess_" +
      Math.random().toString(36).substring(2) +
      "_" +
      Date.now().toString(36);
    memoryDb.sessions.set(token, userId);
    return token;
  },

  // Validate a session token and return the associated user
  getUserBySession: async (token) => {
    if (!token) return null;
    const userId = memoryDb.sessions.get(token);
    if (!userId) return null;
    return db.findUserById(userId);
  },

  // Invalidate a session token (Logout)
  deleteSession: async (token) => {
    if (token) {
      memoryDb.sessions.delete(token);
    }
  },
};

