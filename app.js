const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

module.exports = app;
app.use(express.json());

const db_path = path.join(__dirname, "todoApplication.db");

let db = null;

const initalizeDbAndServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running!");
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
  }
};
initalizeDbAndServer();

//API 1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;
  if (status !== undefined && priority !== undefined) {
    const query1 = `SELECT * FROM todo 
      WHERE status='${status}' AND priority='${priority}'`;
    const todoResponse = await db.all(query1);
    response.send(todoResponse);
  } else if (status !== undefined) {
    const query1 = `SELECT * FROM todo
      WHERE status='${status}'`;
    const todoResponse = await db.all(query1);
    response.send(todoResponse);
  } else if (priority !== undefined) {
    const query1 = `SELECT * FROM todo
      WHERE priority='${priority}'`;
    const todoResponse = await db.all(query1);
    response.send(todoResponse);
  } else {
    const query1 = `SELECT * FROM todo
      WHERE todo LIKE '%${search_q}%'`;
    const todoResponse = await db.all(query1);
    response.send(todoResponse);
  }
});

//API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query2 = `SELECT * FROM todo 
    WHERE id=${todoId};`;
  const todoResult = await db.get(query2);
  response.send(todoResult);
});

//API 3
app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const query3 = `INSERT INTO todo(id,todo,priority,status)VALUES(${id},'${todo}','${priority}','${status}');
    `;
  await db.run(query3);
  response.send("Todo Successfully Added");
});

//API 4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status, priority, todo } = todoDetails;
  if (status !== undefined) {
    const query4 = `UPDATE todo SET status='${status}'
      WHERE id=${todoId};`;
    await db.run(query4);
    response.send("Status Updated");
  } else if (priority !== undefined) {
    const query4 = `UPDATE todo SET priority='${priority}'
      WHERE id=${todoId};`;
    await db.run(query4);
    response.send("Priority Updated");
  } else {
    const query4 = `UPDATE todo SET todo='${todo}'
      WHERE id=${todoId};`;
    await db.run(query4);
    response.send("Todo Updated");
  }
});

// API 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query5 = `DELETE FROM todo WHERE id=${todoId};`;
  await db.run(query5);
  response.send("Todo Deleted");
});
