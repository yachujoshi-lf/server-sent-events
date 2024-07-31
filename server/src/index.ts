import type { Request, Response } from "express";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 3000;

let facts: Fact[] = [];
let clients: Client[] = [];

interface Client {
  id: number;
  response: Response;
}

interface Fact {
  info: string;
  source: string;
}

function eventsHandler(request: Request, response: Response) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(facts)}\n\n`;

  response.write(data);

  const clientId = Date.now();
  const newClient = { id: clientId, response };

  clients.push(newClient);
  console.log(`${clientId} Connection Opened.`);

  request.on("close", () => {
    console.log(`${clientId} Connection Closed.`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function sendEventsToAll(newFact: Fact) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
  );
}

async function addFact(request: Request, response: Response) {
  const newFact = request.body;
  facts.push(newFact);

  response.json(newFact);

  return sendEventsToAll(newFact);
}

app.get("/status", (request: Request, response: Response) =>
  response.json({ clients: clients.length })
);

app.post("/fact", addFact);
app.get("/events", eventsHandler);

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});
