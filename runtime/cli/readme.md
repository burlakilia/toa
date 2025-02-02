# Toa Command Line Interface

## Development

### configure

Outputs shell commands to manipulate local environment variables, thus must be piped
with `source /dev/stdin` to apply.

<dl>
<dt><code>toa configure &lt;key&gt; [value]</code></dt>
<dd>
Set Configuration Object key. Nested keys are addressed with dot notation.

<code>--path</code> path to component (default <code>.</code>)<br/>
<code>--reset</code> clear <code>key</code><br/>

#### Examples

It is assumed you are in the component's directory, use `--path` otherwise.

```shell
# set new value
$ toa configure foo 'new value' | source /dev/stdin
```

```shell
# clear key
$ toa configure bar.baz --reset | source /dev/stdin
```

</dd>
<dt><code>toa configure reset</code></dt>
<dd>Remove Configuration Object.</dd>
<dt><code>toa configure print</code></dt>
<dd>Output Configuration Object as YAML.

<code>--json</code> as JSON
</dd>
</dl>

### replay

[Replay](/extensions/sampling/docs/replay.md) samples. Reports in [TAP](https://testanything.org)
format.

<dl>
<dt><code>toa replay [paths...]</code></dt>
<dd>
<code>paths</code> path(s) to component(s) or a context (default <code>.</code>)<br/>

#### Examples

```shell
$ toa replay
$ toa replay ./path/to/component
$ toa replay ./components/a ./components/b
$ toa replay ./components/*
$ toa replay ./path/to/context
```

If path is a context directory (containing `context.toa.yaml` file), samples for components within
the context will be found and replayed sequentially.

</dd>
</dl>

## Exporting

### export manifest

<dl>
<dt><code>toa export manifest</code></dt>
<dd>Print normalized manifest.

<code>--path</code> path to component (default <code>.</code>)<br/>
<code>--error</code> print errors only<br/>
</dd>
</dl>

## Deployment

> Deployment commands use current `kubectl` context.

### deploy

<dl>
<dt><code>toa deploy [environment]</code></dt>
<dd>Deploy context.</dd>
</dl>

### conceal

<dl>
<dt>
<code>toa conceal</code>
<img src="https://img.shields.io/badge/Not_Implemented-red" alt="Not Implemented"/>
</dt>
<dd>Deploy new declared secrets.

<code>--reset</code> don't skip already deployed</dd>

<dt><code>toa conceal &lt;secret&gt; &lt;key&gt; &lt;value&gt;</code></dt>
<dd>Deploy a <code>key</code> with a <code>value</code> to a <code>secret</code>.</dd>
</dl>

### reveal

<dl>
<dt>
<code>toa reveal &lt;secret&gt;</code>
</dt>
<dd>Print keys and values of a secret.</dd>
</dl>
