# Choosing Your Agent-Type: LLM Call vs. Agentic Workflow vs. Autonomous Agent

> Most teams reach for an "agent" before they've earned one. The three patterns below are not a ladder you must climb — they are a **spectrum of control vs. autonomy**, and the winning move is picking the *least* autonomous option that still solves the problem. This guide explains the difference, when to use each, and how to implement them.

---

## How to Read This Guide

Every pattern is presented from two angles:

| Section | What it answers |
|:--------|:----------------|
| **The Comparison** | What each type *is*, what it's *for*, and *when* to choose it |
| **The Implementation Guide** | A concrete decision path plus a playbook per pattern |

---

## The One-Sentence Version

- **LLM call** → you ask the model to *produce something* once. Zero tooling.
- **Agentic workflow** → *you* orchestrate many model calls (and tools) along a fixed, deterministic path. The model thinks; the code decides.
- **Autonomous agent** → *the model* decides its own path, loops until the goal is met, and calls tools on its own. The model both thinks *and* decides.

The real axis here is: **who owns the control flow — your code or the model?**

---

## The Comparison Matrix

| Dimension | 🎯 LLM Call | 🔀 Agentic Workflow | 🤖 Autonomous Agent |
|:----------|:------------|:--------------------|:--------------------|
| **What it is** | A single prompt → single response round trip | A code-defined pipeline of model calls, tools, and checks | A model-driven loop that plans, acts, observes, and iterates |
| **Who owns the control flow** | Your code (trivially) | **Your code** — steps are fixed and ordered | **The model** — steps are chosen per-run |
| **Number of LLM calls** | 1 (or a few-shot batch in one call) | Multiple, deterministic, orchestrated | Many, dynamic, decided at runtime |
| **Decision-making** | Token-level only | Yours — via branches, validation, retries | The model's — tool choice, ordering, when to stop |
| **Latency** | Lowest (one round trip) | Medium (sequential steps, some parallel) | Highest (many round trips, planning overhead) |
| **Cost per task** | Lowest | Medium | Highest |
| **Consistency / control** | Low — output varies per call | High — same path every time | Low-to-medium — path varies per run |
| **Flexibility / adaptability** | Very low | Medium — only within the branches you wrote | High — handles novel situations |
| **Failure behavior** | Failure = retry the call | Failure = your error-handling logic (bounded) | Failure = self-correction loop (unbounded) |
| **Observability** | Trivial — one call to log | Easy — bounded, instrumented steps | Hard — unbounded trajectory to trace |
| **Best metaphor** | A calculator | An assembly line | A contractor with a task list |

---

## Pattern 1: LLM Call

### What it is 🟢

The atomic unit of everything below: **one prompt in, one completion out.** You put examples in the prompt (few-shot) or not (zero-shot), call the API once, get a structured or free-form answer, and your code does something with it. No tools, no loops, no second call.

```
input ──▶ [Prompt + examples] ──▶ LLM ──▶ output ──▶ your code handles it
```

### What it should be used for

Single-shot transformations where a model's raw capability is enough:

- **Classification / tagging** — sentiment, topic, intent, priority.
- **Extraction** — pull fields out of text (structured output mode).
- **Summarization** — condense a document to N bullets.
- **Translation / rewriting** — one text in, one text out.
- **Generation** — a draft, a headline, a test case, SQL from a question.
- **Quick answers** — Q&A over a small, self-contained context.

### When to use it

Use an LLM call when **all** of these are true:

- The task is **self-contained** — one input, no need to look anything up or run anything.
- **Accuracy is good enough on the first shot** — you don't need a verification pass.
- **Latency is a hard requirement** — interactive UIs, user-facing autocomplete, under ~1s budgets.
- The **cost of being wrong is low** — a bad classification is cheap to catch elsewhere.

> **Rule of thumb**: if a `function prompt_once(question) -> answer` solves it, don't build an agent.

---

## Pattern 2: Agentic Workflow

### What it is 🟢

A **deterministic, code-orchestrated sequence** of LLM calls and tools. You hard-code the steps — *step 1: extract → step 2: validate schema → step 3: query the DB → step 4: draft → step 5: critique → step 6: fix*. The model never decides *what* to do next; it only produces results your code routes.

This is the pattern Anthropic popularized in *Building Effective Agents* — e.g., **prompt chaining**, **routing**, **parallelization**, **evaluator-optimizer**, and **orchestrator-workers** all live under this roof.

```
step 1 ──▶ check ──▶ step 2 ──▶ tool call ──▶ step 3 ──▶ validate ──▶ output
   │         │                                    │
   └── retry ┘                              ┌─────┘
                                            ▼
                                     repair / escalate
```

### What it should be used for

Multi-step tasks where **each step must be correct before the next runs**:

- **RAG pipelines** — retrieve → re-rank → ground → answer.
- **Data transformations** — extract unstructured → validate schema → map → load.
- **Quality-gated generation** — draft → critique → revise until it passes.
- **Code assistants** — generate → run tests → iterate on failures.
- **Customer support flows** — understand issue → look up account → draft reply → human approval.
- **Anything with business rules** — insurance claims, compliance checks, content moderation.

### When to use it

Use an agentic workflow when you need **consistency and control**:

- The task has **known, repeatable steps** — you can enumerate them at design time.
- **Outputs must meet constraints** — schema, business rules, factual grounding; you want deterministic validation between steps.
- **One call isn't reliable enough** — you need a verify pass, a retry path, or a fallback.
- **You can afford the latency** of 2–10 sequential calls (a few seconds).
- **Failures must be bounded** — you want to know exactly where a run failed and why.

> **Rule of thumb**: if you can draw the flowchart of the task on a whiteboard, it's an agentic workflow — not an autonomous agent.

---

## Pattern 3: Autonomous Agent

### What it is 🟢

A **model-driven loop** where the LLM is given a goal, a set of tools, and the freedom to plan and act until the goal is achieved (or it gives up). At each iteration the model decides: *what tool to call, with what arguments, whether to keep going, and when it is done.*

```
goal ──▶ [LLM decides: plan / next action] ──▶ tool call ──▶ observe result ──▶ repeat
              ▲                                                            │
              └────────────────────────── done? ────────────────────────────┘
```

The archetype is the **ReAct loop**: *Reason → Act → Observe* repeated until success. Also includes hierarchical multi-agent systems where a supervisor delegates to specialized subagents.

### What it should be used for

Open-ended tasks where **the path cannot be enumerated in advance**:

- **Web / API research** — "find me the cheapest flight and book it" — the number of searches is unknowable up front.
- **Software engineering agents** — browse the repo, edit files, run tests, fix failures, repeat.
- **Complex data investigations** — "figure out why revenue dropped" — needs iterative querying and follow-ups.
- **Operations / general-purpose assistants** — tasks that combine many services with variable steps.
- **Customer-facing concierge agents** — multi-turn tasks that span systems no fixed flow covers.

### When to use it

Use an autonomous agent only when the previous two genuinely can't work:

- The **completion path is unknown at design time** — you can't write the branches because you don't know what the run will encounter.
- **Flexibility is worth more than consistency** — the same goal may need wildly different steps per run.
- The model has **enough safe tools** to self-correct — a feedback loop (tests, validators, sandbox) exists to catch its mistakes.
- You can **absorb cost and latency** — this is the most expensive pattern per task.
- You can tolerate (and govern) **non-deterministic behavior** — same goal, different trajectories, sometimes failure.

> **Rule of thumb**: reach for an autonomous agent only when *"ask the model once"* and *"script the steps"* are both insufficient. Autonomy is a liability, not a feature, until you have guardrails.

---

## Decision Flow

```
Start: describe the task
│
├─ Can it be solved in ONE call with acceptable accuracy?
│     └─ YES ──▶ Require low latency? ──▶ YES ──▶ 🎯 LLM call (zero/few-shot)
│                                        └─ NO  ──▶ 🎯 LLM call (few-shot + structured output)
│
├─ Can you enumerate the steps at design time?
│     └─ YES ──▶ Need consistency + control? ──▶ YES ──▶ 🔀 Agentic workflow
│                                                  └─ (if one call fails validation) ──▶ 🔀 still workflow
│
└─ Is the path unknowable / highly variable in advance?
      └─ YES ──▶ Need flexibility + autonomy, have guardrails? ──▶ YES ──▶ 🤖 Autonomous agent
                                          └─ NO ──▶ shrink the scope until a workflow fits
```

### The short version

| Need | Choose |
|:-----|:-------|
| **Simple + low latency** | 🎯 **LLM call** — 1-shot or few-shot, structured output |
| **Consistent + more control** | 🔀 **Agentic workflow** — your code owns the steps |
| **Flexible + autonomous** | 🤖 **Autonomous agent** — the model owns the steps, within guardrails |

---

## Implementation Guide

### 1. 🎯 LLM Call — Simple & Low Latency

**Choose this when**: the task is single-shot, latency matters, and first-shot accuracy is acceptable.

**Playbook**:

1. **Start zero-shot.** Write one clear, directive prompt. Measure accuracy.
2. **Add few-shot examples only if needed** — 2–5 representative input/output pairs beat verbose instructions for formatting and edge cases. Each example costs tokens; stop when accuracy plateaus.
3. **Use structured output** — `response_format` (OpenAI), tool-use (Anthropic), `response_schema` (Gemini) — not "return JSON" + regex.
4. **Keep latency low**:
   - Route to the **smallest capable model** — most single-shot tasks don't need a frontier model.
   - Trim context — fewer tokens = faster prefill.
   - Move static prompt content first so **prompt caching** works.
5. **Bound the failure** — validate schema + business rules in code; retry once on parse failure with a stricter prompt, then fall back to a default.

> **Anti-pattern**: bolting a "loop with an LLM judge" onto a single call. If you need a second call to verify, you've graduated to a workflow — do it properly.

### 2. 🔀 Agentic Workflow — Consistent & Controlled

**Choose this when**: steps are enumerable, and you need deterministic quality gates.

**Playbook**:

1. **Draw the DAG first.** List every step and its inputs/outputs. Identify branches that can run in **parallel** (`Promise.all` / `asyncio.gather`) — this is the single biggest latency win.
2. **Make every step atomic and checkpointable** — serialize context before each expensive call so you can roll back to the last valid state.
3. **Add validation gates between steps**:
   - Schema validation (free, first).
   - Business-rule checks (free, second).
   - Embedding-similarity grounding for RAG outputs.
   - LLM-as-judge **only** where human-judgment-like evaluation is genuinely required.
4. **Classify failures before retrying**:
   - **Transient** (timeout, 5xx, rate limit) → retry with exponential backoff + jitter.
   - **Semantic** (output violates rules/schema) → **never retry the same context**; roll back and invoke a repair handler.
5. **Apply the routing pattern** — orchestration/planning steps get the frontier model; extraction/RAG/navigation steps get a lightweight model; escalate on low confidence.
6. **Instrument every node** — log `model_id`, tokens, `latency_ms`, `tool_calls`, `retry_count`, `failure_reason`. Build p50/p95 views per step.

**Reference architecture (evaluator-optimizer)**:

```
generator ──▶ validator ──▶ pass? ──▶ output
   ▲              │
   └── revise ────┘  (max N iterations, then escalate)
```

### 3. 🤖 Autonomous Agent — Flexible & Autonomous

**Choose this when**: the path is unknowable up front, and you have guardrails to absorb risk.

**Playbook**:

1. **Start with ReAct, not multi-agent.** One loop: *reason → act → observe*. Multi-agent hierarchies multiply cost and debugging pain; introduce them only when one loop can't manage scope.
2. **Give it a tight goal and explicit stop conditions** — define "done" and a **max iterations / max cost / max time** budget. An agent without a budget is a runaway credit card.
3. **Restrict the toolset** — expose only the tools relevant to the goal. One tool, one job. Fewer tools = fewer hallucinated calls.
4. **Make tools safe to retry** — **idempotency keys** on any tool with side effects (writes, payments), so a retry can't double-execute.
5. **Return structured errors from tools** — never silent empties; the agent needs the failure signal to self-correct.
6. **Add human-in-the-loop checkpoints** for irreversible actions — approval required before *send*, *pay*, *delete*, *deploy*.
7. **Instrument the trajectory** — log the full action/observation chain, not just the final answer. You'll need the trace for debugging and audit.
8. **Sandbox everything** — the agent operates on a staging dataset/isolated environment until proven reliable.

**Guardrail minimum (non-negotiable)**:

- Max steps, max tokens, max wall-clock time.
- Idempotency on side effects.
- Human approval on irreversible actions.
- Full trajectory logging.

---

## Escalation Path (Think Before You Build)

| Scenario | Start with | Escalate to | Why |
|:---------|:-----------|:------------|:----|
| Classify a support ticket | 🎯 LLM call | 🔀 Workflow if classification + follow-up actions needed | One call is enough for the label itself |
| Summarize a long doc | 🎯 LLM call with chunked input | 🔀 Map-reduce workflow if doc exceeds context | Fixed structure — no autonomy needed |
| Answer questions over a codebase | 🔀 RAG workflow | 🤖 Autonomous agent if the queries require multi-hop repo exploration | Enumerating every query path is impossible |
| Fix a failing test | 🔀 Workflow (reproduce → diagnose → patch → rerun) | 🤖 Agent if the fix itself requires exploring unknown code | Known steps get deterministic control |
| "Plan a trip and book it" | Pointless as a call | 🤖 Autonomous agent (or workflow with human approval) | Search count and ordering are unknowable |

---

## Cost / Latency Reality Check

| Pattern | Calls per task | Typical end-to-end latency | Typical relative cost |
|:--------|:---------------|:---------------------------|:----------------------|
| 🎯 LLM call | 1 | ~0.3–2s | 1× |
| 🔀 Agentic workflow | 2–10 | ~1–10s | 3–10× |
| 🤖 Autonomous agent | 5–50+ | ~10s–minutes | 10–50× |

> **The pragmatic rule**: every pattern is a *many call* pipeline with different trust in the control flow. If a workflow with 5 calls solves it, an agent with 20 calls adds risk, not capability. Autonomy should be earned, not assumed.

---

## Final Takeaway

1. **Prefer the least autonomous option that works.** Simple + low latency → **LLM call**. Consistent + controlled → **agentic workflow**. Flexible + autonomous, *with guardrails* → **autonomous agent**.
2. **Escalate deliberately** — the progression is *call → workflow → agent*, and each step up multiplies cost, latency, and failure surface.
3. **Defer autonomy until you have observability and guardrails** — instrument first, cap iteration budgets, sandbox tool access, and gate irreversible actions behind a human.
4. Remember the phrase that separates the two advanced patterns: **in a workflow, your code leads; in an agent, the model leads — and only the model can go off-script.**

*Master the pattern choice, not the library. The tools will change; the control-vs-autonomy decision will not.*