import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 11,
  title: "Session Options, Overrides and Deadlines",
  description: "An agent defines reusable behavior, but an application may need to vary one session. You might test another model, compare behavior without the base system prompt, limit list cost, or stop waiting after a web-request deadline.",
  concepts: ["Full-field override replacement", "Positive budgets", "Local deadlines differ from remote state"],
  scope: "Resolves a local configuration and deadline plan; it does not update a provider budget. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Resolve a text-only override", "input": {"budgetCents": 50, "deadlineMs": 3000, "clearTools": true}, "expected": "passed", "checks": {"toolCount": 0}}, {"id": "1", "label": "Reject an invalid budget", "input": {"budgetCents": 0, "deadlineMs": 3000, "clearTools": true}, "expected": "rejected", "checks": {}}],
  async run(input) {

const budget=number(input,"budgetCents"), deadline=number(input,"deadlineMs");
if(!Number.isSafeInteger(budget)||budget<1||deadline<1) return report("rejected","Budget and deadline must be positive",{},["Validate configuration before session creation"]);
const tools=flag(input,"clearTools")?[]:["read","glob"];
return report("passed","Resolved the selected session configuration",{toolCount:tools.length,effective:{model:"base-model",system:null,tools,mcp_servers:[],skills:[]},budgetCents:budget,localDeadlineMs:deadline,remoteStopOnDeadline:"not established"},["Inherit omitted model","Clear system with null","Replace the entire tools list","Keep local timeout separate from remote interruption"]);

  }
};
