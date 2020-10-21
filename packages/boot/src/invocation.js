const clone = require('clone');
const { Invocation, Endpoint, Operation } = require('@kookaburra/runtime');
const schema = require('./schema');
const query = require('./query');

module.exports = (locator, state, remotes) => (descriptor) => {
    if (typeof descriptor.manifest === 'string')
        descriptor.manifest = { template: descriptor.manifest };

    if (descriptor.manifest === undefined)
        descriptor.manifest = {};

    if (descriptor.manifest === null)
        descriptor.manifest = { template: descriptor.name };

    if (descriptor.manifest.template !== undefined) {
        if (typeof descriptor.manifest.template === 'string')
            descriptor.manifest.template = { operation: descriptor.manifest.template };

        if (descriptor.manifest.template === null)
            descriptor.manifest.template = { operation: descriptor.name };


        const module = descriptor.manifest.template.module || '@kookaburra/templates';
        const name = descriptor.manifest.template.operation;

        const template = require(module)[name];

        template(clone(state.manifest), descriptor);
    }

    const meta = {};

    if (descriptor.manifest.http !== undefined) {
        if (typeof descriptor.manifest.http === 'string')
            descriptor.manifest.http = [{ path: descriptor.manifest.http }];

        meta.http = descriptor.manifest.http.map(binding => {
            if (typeof binding === 'string')
                return { path: binding };

            return query(binding);
        });
    }

    const endpoint = new Endpoint(locator, descriptor.name);
    const operation = new Operation(endpoint, meta, descriptor.algorithm, state, remotes);

    return new Invocation(operation, schema(descriptor.manifest?.schema, state.manifest));
};
