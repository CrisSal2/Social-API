const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');
const reactionSchema = require('./Reaction');


const thoughtSchema = new Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => dayjs(createdAt).format('DD/MM/YYYY hh:mm:ss'),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
});


thoughtSchema.virtual('reactionCount').get(function () {
  try {
    return this.reactions.length;
  } catch {
    return 0;
  }
});


const Thought = model('Thought', thoughtSchema);

module.exports = Thought;