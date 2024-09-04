const userNames = [
    "coolCat123",
    "techGuru",
    "blueSky45",
    "silentShadow",
    "happyCamper",
    "starGazer98",
    "codingNinja",
    "chillVibes",
    "pixelMaster",
    "fastRunner"
];

const thoughts = [
    "This is awesome!",
    "I totally agree with you.",
    "Great post, thanks for sharing.",
    "I learned something new today.",
    "This is so inspiring!",
    "Couldnt have said it better myself.",
    "What a thoughtful perspective.",
    "Thanks for the detailed explanation!",
    "Im not sure I understand, could you clarify?",
    "Looking forward to more content like this!"
];

const thoughtReactions = ['Like', 'Dislike'];

// Get a random value from an array
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random username by combining two random user names
function randomUsername() {
    return `${random(userNames)}_${random(userNames)}`;
};

// Generates thoughts
function generateThoughts(count, reactionsPerThought = 2) {
  return Array.from({ length: count }, () => ({
    thoughtText: random(thoughts),
    reactions: generateReactions(reactionsPerThought),
  }));
}

// Generate reactions for a thought
function generateReactions(count) {
  return Array.from({ length: count }, () => ({
    reactionBody: random(thoughtReactions),
    username: randomUsername(),
  }));
}

module.exports = { randomUsername, generateThoughts, random };