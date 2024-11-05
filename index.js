const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
  }

  type Query {
    getTask(id: ID!): Task
    getTasks: [Task]
  }

  type Mutation {
    createTask(title: String!, description: String, status: String!): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): Task
  }
`);

let tasks = [];
let idCounter = 1;

const root = {
  getTask: ({ id }) => tasks.find(task => task.id == id),
  getTasks: () => tasks,
  createTask: ({ title, description, status }) => {
    const newTask = { id: idCounter++, title, description, status };
    tasks.push(newTask);
    return newTask;
  },
  updateTask: ({ id, title, description, status }) => {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) return null;
    const task = tasks[taskIndex];
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    return task;
  },
  deleteTask: ({ id }) => {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) return null;
    const deletedTask = tasks.splice(taskIndex, 1);
    return deletedTask[0];
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
