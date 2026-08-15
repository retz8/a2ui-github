# Semantic Computer
## Toward an LLM-Native Computer Architecture

> A speculative architectural note — not part of the research proposal.

This note began with an observation from working on two seemingly unrelated projects: an LLM-driven scheduler, where a semantic recognition layer sits close to the OS, and an A2UI canvas shell, where an orchestrator generates interfaces above applications.

They initially appeared to solve different problems.

They no longer do.

Both are instances of the same architectural shift:

**moving semantic understanding from the application layer into the computer itself.**

The more interesting possibility is not simply to place an LLM in the UI or inside the operating system. It is to make **semantic state a first-class system abstraction**, shared across the UI, operating system, and hardware.

This note explores that possibility.

Nothing here is a claim the research proposal makes or requires. The research proposal stands on its own. This is a speculative architectural direction that emerged from thinking about where the recognition layer could eventually lead.

---

## 1. From AI Applications to a Semantic Computer

Today's computers expose mostly mechanical state.

A system can know that:

- Chrome is running.
- VS Code has 2 GB of memory.
- A game is consuming 80% of the GPU.
- A process is waiting on I/O.
- A network connection is active.

But these facts do not constitute a semantic understanding of what the machine is doing.

The computer does not inherently know that:

- the user is researching a topic;
- VS Code and Chrome are part of the same task;
- a game is foreground interactive work;
- Spotify is merely background activity;
- a compiler is supporting the user's current development task.

Applications increasingly possess this semantic information. LLM agents possess even more of it.

The operating system largely does not.

This suggests a possible architectural shift:

> **The next computer abstraction may not be another mechanism layer. It may be a semantic layer.**

Instead of treating user intent as something consumed exclusively by applications, the system could maintain a semantic representation of the machine's current state and use that representation across multiple layers.

---

## 2. Semantic State as a First-Class Abstraction

A conventional system can be thought of roughly as:

```text
User
  ↓
Applications
  ↓
Operating System
  ↓
Hardware
```

An LLM-native computer would introduce semantic interpretation throughout this stack:

```text
                         USER
                           │
                    intent / language
                           │
                           ▼
                 ┌────────────────────┐
                 │   Semantic UI       │
                 │   A2UI / agents     │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │      S-FSM         │
                 │ Semantic State     │
                 │ + Transitions      │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │   Semantic OS      │
                 │ scheduler / I/O /  │
                 │ memory / power     │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Semantic Hardware  │
                 │ CPU / GPU / NPU    │
                 └────────────────────┘
```

The key idea is not that every layer becomes an LLM.

Instead:

**semantic state becomes shared infrastructure.**

The UI can project it into an interface.

The OS can project it into resource policy.

Hardware can execute the resulting policy.

---

## 3. S-FSM: Semantic Finite State Machine

This suggests a possible abstraction:

> **S-FSM — Semantic Finite State Machine**

A conventional FSM represents a system as a set of discrete states and transitions between them.

An S-FSM extends this idea by making the state itself semantic.

A simplified formulation is:

```text
Semantic State
    = f(User Intent, Machine State, Context)
```

The underlying machine remains observable through conventional mechanisms:

```text
processes
CPU utilization
GPU utilization
memory
I/O
network
devices
```

But an LLM-based semantic interpreter maps those observations into a bounded semantic representation:

```text
STATE {
    primary_intent: RESEARCH,
    secondary_intent: DEVELOPMENT,
    context: TECHNICAL_WORK,
    latency_class: INTERACTIVE,
    power_preference: BALANCED,
    confidence: 0.91
}
```

The important distinction is that the LLM does **not** become the state machine itself.

It interprets evidence and proposes semantic state or transitions.

The actual system operates on a restricted vocabulary and validated state representation.

```text
Machine State ────────┐
                      │
                      ▼
                Semantic LLM
                      │
User Intent ──────────┘
                      │
                      ▼
                 S-FSM State
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
            UI        OS       HW
```

This separation makes the semantic layer expressive without making the underlying system dependent on arbitrary natural-language output.

---

## 4. The Two Semantic Layers

The original observation remains important.

There are naturally two semantic sources.

### Upper semantic layer

The upper layer belongs to the application and agent ecosystem.

It knows things the OS cannot reliably infer:

- what an agent launched;
- why it launched it;
- what task it belongs to;
- what the user explicitly requested;
- what the agent believes the next step should be.

For example:

```text
User:
"Download the dataset and analyze it."

Agent:
declares:
    downloader → DATA_ACQUISITION
    python     → DATA_ANALYSIS
```

The orchestrator does not need to infer these relationships. It already knows them.

### Lower semantic layer

The lower layer observes the machine itself.

It can see things the orchestrator cannot:

- applications the user launched directly;
- cron jobs;
- antivirus scans;
- system daemons;
- background updates;
- processes belonging to applications that never interacted with the agent.

It therefore needs inference.

```text
process names
command lines
resource behavior
runtime relationships
        │
        ▼
recognition model
        │
        ▼
semantic machine state
```

The two layers have complementary blind spots.

| | Upper layer | Lower layer |
|---|---|---|
| Agent-launched process | knows | can infer |
| User-launched game | does not know why | can infer |
| Cron job | usually does not know | can infer |
| Antivirus | usually does not know | can infer |
| System daemon | usually does not know | can infer |
| User's explicit intent | knows | cannot know |
| Why a process exists | knows for its own actions | usually cannot know |

Therefore the architecture should not choose between declaration and inference.

It should combine them.

> **Declared intent overrides inference for processes it covers. Everything else remains inferred.**

This makes inference a permanent part of the architecture rather than temporary scaffolding that disappears once agents become ubiquitous.

---

## 5. One Model, Two Hats

The upper and lower semantic layers do not necessarily require different models.

They could potentially use the **same local LLM**, possibly sharing the same weights while operating under different contexts, prompts, schemas, and validators.

```text
                         NPU
                          │
                 ┌────────▼────────┐
                 │   Local LLM     │
                 │   same weights  │
                 └───────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       Upper semantic         Lower semantic
          context                context
              │                     │
       declared intent         machine state
              │                     │
              └──────────┬──────────┘
                         ▼
                      S-FSM
                         │
                 semantic policy
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
             UI         OS          HW
```

This is potentially more interesting than having an independent AI model at every layer.

The computer could have a **persistent semantic substrate** implemented by a local model, while different system components consume different projections of its interpretation.

The distinction is therefore not necessarily:

> one model per layer.

It may instead be:

> **one semantic model, multiple bounded roles.**

The separation must still be structural.

The same model weights do not imply the same authority.

---

## 6. Knowledge Should Converge; Authority Should Not

The central security principle is:

> **Semantic knowledge may converge. Authority must remain separated.**

The upper layer reads information from agents and applications.

The lower layer feeds information into the kernel.

These should meet at a restricted semantic interface rather than through unrestricted natural-language communication.

This is structurally similar to A2UI.

A2UI asks:

> How does an agent send a rich UI across a trust boundary without executing arbitrary code?

Its answer is a declarative description restricted to components that the client has pre-approved.

The semantic OS asks:

> How does an LLM-derived semantic judgment influence the kernel without granting arbitrary policy authority?

Its answer can be structurally similar:

```text
LLM
 │
 ▼
semantic vocabulary
 │
 ▼
validator
 │
 ▼
policy constraints
 │
 ▼
kernel
```

In both cases, the model is useful precisely because it is **not trusted with unrestricted execution authority**.

```text
agent
   │
   │ component catalog
   ▼
 client


orchestrator
   │
   │ semantic vocabulary
   ▼
 kernel
```

The vocabulary is the boundary.

---

## 7. Why the Semantic Layers Should Not Merge

They converge on semantic knowledge.

They should not converge on authority.

### Trust boundary

The orchestrator consumes output from third-party agents.

If that output could directly determine kernel policy, arbitrary application-level text would gain a path into resource allocation.

The lower layer should therefore maintain a narrow, validated interface.

### Availability

The OS must boot and schedule without an orchestrator.

An orchestrator is application software.

It can crash, update, disappear, or never be installed.

The kernel cannot depend on it.

### Agents will lobby

Agents will naturally claim that their work is important.

An agent can describe its task convincingly in natural language.

That does not mean it should receive unlimited CPU, GPU, memory, or power.

Someone must be able to say no.

That authority belongs below the trust boundary.

Declared intent should therefore pass through the same vocabulary restrictions, validation, and policy constraints as inferred intent.

This creates a useful architectural principle:

> **One model, two hats; one semantic state, separate authority domains.**

---

## 8. The NPU as the Semantic Substrate

This architecture also gives the NPU an unusually natural role.

The lower semantic workload has a distinctive profile:

- low duty cycle;
- small structured outputs;
- loose latency requirements;
- relatively small models;
- continuous availability;
- and, critically, little tolerance for competing with the GPU or CPU.

A semantic recognition model does not need to generate thousands of tokens.

It may only need to inspect a set of processes periodically and produce a small structured state update.

That makes the workload potentially well suited to an NPU.

The important point is not:

> “NPU becomes useful when models become sufficiently powerful.”

The more interesting possibility is:

> **The semantic layer is an always-available workload that can naturally live on the NPU.**

A single local model could potentially support both the upper and lower semantic contexts while leaving the GPU available for the work the user actually cares about.

---

## 9. Semantic State as a Cross-Layer Contract

If S-FSM becomes the shared abstraction, the same semantic state can be projected differently by different system layers.

Suppose the semantic state is:

```text
USER_ACTIVITY = TECHNICAL_RESEARCH
PRIMARY = DOCUMENT_READING
SECONDARY = CODE_IMPLEMENTATION
LATENCY = INTERACTIVE
POWER = BALANCED
```

The UI might interpret this as:

```text
prioritize:
    browser
    editor
    documentation
```

The OS might interpret it as:

```text
increase:
    interactive priority
    memory retention

decrease:
    background activity
```

Hardware-facing policy might interpret it as:

```text
avoid:
    unnecessary GPU wakeups

prefer:
    CPU efficiency

NPU:
    maintain semantic monitoring
```

The important idea is that these are not three independent personalization systems.

They are **three projections of one semantic state**.

That creates a path from:

```text
Personalized UI
      ↓
Personalized semantic state
      ↓
Personalized OS policy
      ↓
Personalized hardware behavior
```

This is a deeper form of personalization than changing colors, layouts, recommendations, or application settings.

The computer is personalized because **the machine itself understands the user's current mode of work.**

---

## 10. Toward an LLM-Native Computer Architecture

This leads to a broader architectural hypothesis.

An LLM-native computer is not simply:

> a conventional computer with an LLM application installed.

Instead:

> **An LLM-native computer is a computer in which semantic state is a first-class system abstraction, continuously interpreted from user intent and machine state, and projected across the UI, operating system, and hardware.**

Under this view:

```text
LLM
    = semantic interpreter

S-FSM
    = semantic state + transition model

UI
    = semantic state presentation

OS
    = semantic state policy

Hardware
    = semantic state execution
```

The LLM does not replace the mechanisms underneath.

It adds a semantic layer above them.

The renderer remains the renderer.

The scheduler remains the scheduler.

The kernel remains the kernel.

The hardware remains the hardware.

What changes is the information available to those mechanisms.

---

## 11. The Architectural Stack

The resulting system can be viewed as a semantic stack:

```text
┌───────────────────────────────────────────────┐
│                     USER                      │
│             language · actions · intent       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              UPPER SEMANTIC LAYER             │
│        agents · orchestrator · A2UI            │
│                                               │
│        "What is the user trying to do?"       │
└───────────────────────┬───────────────────────┘
                        │
                 declared intent
                        │
════════════════════════╪════════════════════════
                   TRUST BOUNDARY
════════════════════════╪════════════════════════
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                    S-FSM                      │
│                                               │
│      semantic state + semantic transitions    │
│                                               │
│  declared intent + inferred machine state     │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              LOWER SEMANTIC LAYER             │
│                                               │
│        process recognition · context          │
│        resource behavior · machine state      │
│                                               │
│        "What is the machine doing?"            │
└───────────────────────┬───────────────────────┘
                        │
                 validated policy
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                    KERNEL                     │
│          scheduler · memory · I/O · power     │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                   HARDWARE                    │
│              CPU · GPU · NPU · I/O            │
└───────────────────────────────────────────────┘
```

The semantic layer therefore becomes a bridge between **human intent and machine mechanism**.

---

## 12. What Is Actually Hard?

The most difficult parts are not necessarily model intelligence.

### The lower layer

The lower layer is comparatively self-contained.

It can observe machine state, infer process intent, and produce a bounded semantic representation.

It can potentially attach to an existing OS mechanism such as `sched_ext` without requiring the entire computer ecosystem to change.

It also degrades naturally:

```text
semantic scheduler unavailable
        ↓
ordinary scheduler
```

That makes incremental deployment plausible.

### The upper layer

An orchestrator is also technically feasible as a product.

A single organization can build one.

Failure is largely contained to the application.

### The S-FSM interface

The difficult question is defining the semantic contract.

What exactly constitutes a semantic state?

What vocabulary is expressive enough to represent real user activity but constrained enough to be safe?

How are transitions validated?

How is confidence represented?

How quickly should semantic state change?

How do competing semantic interpretations coexist?

These are architecture questions, not merely model questions.

### The cross-vendor layer

A shared semantic computer becomes harder when multiple vendors are involved.

A2UI already demonstrates the coordination problem: multiple agents and clients need to agree on a protocol and component vocabulary.

The same problem appears one level below:

```text
agent ecosystem
        ↓
semantic vocabulary
        ↓
OS
        ↓
hardware vendors
```

There is no obvious reason for every vendor to expose the same semantic contract.

A fully integrated implementation may therefore arrive before a universal standard.

---

## 13. A Possible Future

A plausible progression is:

### Phase 1 — Semantic applications

Agents understand user intent and generate interfaces.

### Phase 2 — Semantic OS

The operating system begins inferring what processes mean and adapting resource allocation.

### Phase 3 — S-FSM

Declared intent and inferred machine state become a shared semantic state representation.

### Phase 4 — Semantic hardware interfaces

Hardware begins exposing mechanisms optimized for semantic policy rather than only mechanical resource requests.

### Phase 5 — LLM-native computer

UI, OS, and hardware become projections of a shared semantic model.

The computer no longer merely executes applications.

It continuously maintains an interpretation of what the user and the machine are doing.

---

## 14. A Personal Computer in the Strongest Sense

This changes the meaning of "personal computer."

The current personal computer is personal largely because it contains the user's files, applications, accounts, and preferences.

A semantic computer could be personal at a deeper level.

It could learn the relationship between:

```text
the user
      +
their intent
      +
their applications
      +
their workflows
      +
their machine
      +
their hardware constraints
```

The personalization would therefore extend vertically:

```text
        Personalized UI
              │
              ▼
       Personalized Intent
              │
              ▼
       Personalized S-FSM
              │
              ▼
        Personalized OS
              │
              ▼
       Personalized Hardware
```

This is not merely a more personalized interface.

It is a **personalized computer architecture**.

---

## 15. The Open Research Question

The original recognition problem remains meaningful regardless of whether the rest of this architecture ever exists.

The fundamental question is:

> **How well can a system infer intent when nobody declared it?**

But the larger architectural question becomes:

> **What happens when semantic understanding becomes a first-class abstraction of the computer?**

S-FSM is one possible answer.

It provides a place where:

- declared intent from agents,
- inferred intent from machine observation,
- and persistent machine context

can meet without granting any single semantic interpreter unrestricted authority.

If that abstraction proves useful, it could become the connective tissue between the layers of an LLM-native computer:

```text
                 USER
                   │
                   ▼
              semantic UI
                   │
                   ▼
              ┌─────────┐
              │  S-FSM  │
              └────┬────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
         UI        OS       HW
                   │
                   ▼
                 NPU
          semantic substrate
```

The mechanism underneath does not disappear.

The computer simply gains something it historically lacked:

**a semantic model of itself.**

That may be the more fundamental transition from an AI-enabled computer to an **LLM-native computer**.