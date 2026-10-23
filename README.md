# C11 · Session Options, Overrides and Deadlines

Resolves a local configuration and deadline plan; it does not update a provider budget. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Full-field override replacement
- Positive budgets
- Local deadlines differ from remote state

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3011`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3011
```

## How the app was build

### 1. Validate spending and observation limits

Reject a nonpositive deadline or a budget that is not a positive safe integer before constructing a session configuration. Budget units are cents.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const budget = number(input, "budgetCents"),
  deadline = number(input, "deadlineMs");

if (!Number.isSafeInteger(budget) || budget < 1 || deadline < 1)
  return report("rejected", "Budget and deadline must be positive", {}, [
    "Validate configuration before session creation",
  ]);
```

### 2. Replace a capability list as one field

clearTools selects an empty list; otherwise the local example selects read and glob. The list is replaced as a whole rather than merged with another list.

Source: [src/lesson.ts](src/lesson.ts#L15)

```typescript
const tools = flag(input, "clearTools") ? [] : ["read", "glob"];
```

### 3. Distinguish resolved options from remote cancellation

The evidence keeps inherited model, null system, complete capability lists, budget and local deadline visible. remoteStopOnDeadline remains not established because a local timeout is not an observed remote stop.

Source: [src/lesson.ts](src/lesson.ts#L16)

```typescript
return report(
  "passed",
  "Resolved the selected session configuration",
  {
    toolCount: tools.length,
    effective: {
      model: "base-model",
      system: null,
      tools,
      mcp_servers: [],
      skills: [],
    },
    budgetCents: budget,
    localDeadlineMs: deadline,
    remoteStopOnDeadline: "not established",
  },
  [
    "Inherit omitted model",
    "Clear system with null",
    "Replace the entire tools list",
    "Keep local timeout separate from remote interruption",
  ],
);
```

### Check your understanding

Run **Resolve a text-only override** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "budgetCents": 50,
    "deadlineMs": 3000,
    "clearTools": true
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "toolCount": 0
  }
}
```

Then try **Reject an invalid budget**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
