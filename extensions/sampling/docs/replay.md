# Sample Replay

## UI extension

Sampling extends UI Request with `sample` property which is an object confirming
the [schema](../src/.component/sample.cos.yaml).

## Core Decorators

Sampling provides a set of [core decorators](#) to substitute operation inputs and verify outputs.

Decorators use sample from shared [async storage](https://nodejs.org/api/async_context.html), that
is, the *sampling context*.

### Component Decorator

If invocation request contains `sample` extension, Sampling Component Decoration creates a sampling
context, invokes operation and verifies:

- request, if `request` is declared[^1];
- reply, if `output` is declared;
- events published, if `events` are declared.

[^1]: request verification is used to test receivers' output
with [message samples](/userland/samples/readme.md).

### Context Decorator

Context decorator validates inputs and substitutes outputs of context calls (local and remote) using
sampling context. If no output is provided, then an actual call is performed.

### Aspect Decorator

Context extension (aspect) decorator validates aspect invocation arguments and substitutes its
returned value.

### Storage Decorator

Storage decorator substitutes current state provided as an input for operation. Samples
of `transitions` may declare a `next` state to validate a transition result. Samples
of `assignments` may declare an `update` to validate an assignment changeset.

### Emitter Decorator

Emitter decorator records events published after operation invocation to a sampling context, which
is then used by Component decorator for verification.

> Autonomous samples replay doesn't emit events to a binding.

### Receiver Decorator

Receiver decorator is discarding incoming messages, containing `component` property not matching
decorated component's id. This allows to replay messages samples with a desired component within
a composition (as receivers can't be called directly).
