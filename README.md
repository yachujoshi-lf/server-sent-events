## Server Sent Events

1. Run the Express Server:

```bash
npm run start
```

2. Run the React Server:

```bash
npm run dev
```

3. Open a connection from the terminal to receive updates:

```bash
curl -H Accept:text/event-stream http://localhost:3000/events
```

4. Send a POST request to add a new fact:

```bash
curl -X POST \
 -H "Content-Type: application/json" \
 -d '{"info": "Hello Everyone", "source": "hello-everyone"}'\
 -s http://localhost:3000/fact
```
