const mongoose = require('../config/connection');
const { User, Thought } = require('../models');
const { randomUsername, generateThoughts, random } = require('../utils/data');

const NUM_USERS = 10;
const NUM_THOUGHTS = 10;

mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));

mongoose.connection.once('open', async () => {
  console.log('Connected to the database. Starting data seeding...');

  try {
    // Clear existing data
    await clearCollections(['thoughts', 'users']);

    // Create and insert users
    const users = await createUsers(NUM_USERS);
    const userData = await User.insertMany(users);

    // Create and insert thoughts with associated users
    const thoughts = createThoughts(NUM_THOUGHTS, userData);
    const thoughtData = await Thought.insertMany(thoughts);

    // Update users with thoughts and friends
    await updateUsersWithThoughtsAndFriends(userData, thoughtData);

    console.info('Data seeded successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    // Close the connection and exit process
    await mongoose.connection.close();
    process.exit(0);
  }
});

// Clear specified collections
async function clearCollections(collectionNames) {
  for (const name of collectionNames) {
    const collectionExists = await mongoose.connection.db
      .listCollections({ name })
      .toArray();
    if (collectionExists.length) {
      await mongoose.connection.db.dropCollection(name);
    }
  }
};

// Create user objects with unique usernames
async function createUsers(count) {
  const usernames = new Set();
  const users = [];

  while (users.length < count) {
    const username = randomUsername();
    if (!usernames.has(username)) {
      usernames.add(username);
      users.push({
        username,
        email: `${username}@gmail.com`.toLowerCase(),
      });
    }
  }

  return users;
};

// Create thought objects with associated users
function createThoughts(count, users) {
  return generateThoughts(count).map((thought) => {
    const user = random(users);
    thought.username = user._id;
    thought.reactions = thought.reactions.map((reaction) => ({
      ...reaction,
      username: random(users)._id,
    }));
    return thought;
  });
};

// Update users with associated thoughts and friends
async function updateUsersWithThoughtsAndFriends(users, thoughts) {
  const userMap = new Map(users.map(user => [user._id.toString(), user]));

  for (const thought of thoughts) {
    const user = userMap.get(thought.username.toString());
    if (user) {
      const friends = Array.from(userMap.values()).filter(
        (u) => u._id.toString() !== user._id.toString()
      );
      await User.findByIdAndUpdate(user._id, {
        $push: {
          thoughts: thought._id,
          friends: random(friends)._id,
        },
      });
    }
  }
};