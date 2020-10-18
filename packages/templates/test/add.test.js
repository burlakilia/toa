const mock = require('./fixtures');
jest.mock('../src/schema', () => mock.schema);

const add = require('../src/add');

beforeEach(() => {
    jest.clearAllMocks();
});

it('should define algorithm', () => {
    const state = {};
    const descriptor = {};

    add(state, descriptor);

    expect(descriptor.algorithm).toBeDefined();
    expect(descriptor.algorithm).toBeInstanceOf(Function);
});

it('should define schema', () => {
    const state = {};
    const descriptor = {};

    add(state, descriptor);

    expect(descriptor.manifest.schema).toBeDefined();
    expect(descriptor.manifest.schema).toEqual(mock.schema.mock.results[0].value);
});

describe('algorithm', () => {
    let io = undefined;
    let object = undefined;

    beforeEach(async () => {
        const state = mock.state();
        const descriptor = mock.descriptor();

        add(state, descriptor);

        io = mock.io();
        object = mock.blank();

        await descriptor.algorithm(io, object);
    });

    it('should assign input to object', () => {
        expect(object).toMatchObject(io.input);
    });

    it('should pass object id to output', () => {
        expect(io.output._id).toEqual(object._id);
    });

});
