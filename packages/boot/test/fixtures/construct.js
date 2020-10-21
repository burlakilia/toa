const clone = require('clone');

const string = () => Math.random().toString(36).substring(2);

const path = string();

const operations = [
    {
        name: 'test',
        algorithm: jest.fn(),
        descriptor: {
            schema: {
                properties: {
                    a: {
                        type: 'number',
                    },
                },
            },
        },
    },
];

const manifest = {
    domain: string(),
    name: string(),
    state: {
        schema: {
            properties: {
                a: {
                    type: 'number',
                },
            },
        },
        collection: {
            limit: 1000,
            projection: ['a'],
        },
        object: {
            projection: ['a', 'b'],
        },
    },
    operations: {
        get: {
            template: {
                module: '@kookaburra/templates',
                operation: 'get',
            },
        },
    },
};

const parsedManifest = clone(manifest);

parsedManifest.state.collection.limit = {
    default: 1000,
    max: 1000,
};

parsedManifest.state.collection.omit = {
    max: 10000,
};

parsedManifest.state.name = parsedManifest.domain;

const load = jest.fn(() => ({
    manifest: clone(manifest),
    operations: clone(operations),
}));

const Locator = jest.fn(function () {
    this.instance = string();
});

const Runtime = jest.fn(function () {
    this.instance = string();
});

const State = jest.fn(function () {
    this.instance = string();
});

const invocation = jest.fn(() => string());

const component = {
    manifest: {
        remotes: [string()],
    },
    operations: [string()],
};

const remotes = [string(), string()];

const resolve = jest.fn(() => ({ name: string(), proxy: string() }));

module.exports = {
    path, operations, manifest, parsedManifest, load, Locator, Runtime, State,
    invocation, component, remotes, resolve,
};
