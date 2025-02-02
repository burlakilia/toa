'use strict'

const chart = {
  apiVersion: 'v2',
  type: 'application',
  name: 'dummies',
  description: 'Integration tests dummies context',
  version: '0.0.0',
  appVersion: '0.0.0',
  dependencies: [
    {
      name: 'rabbitmq',
      repository: 'https://charts.bitnami.com/bitnami',
      version: '9.0.0'
    }
  ]
}

const values = {
  components: expect.arrayContaining([
    'dummies-a',
    'credits-balance',
    'messages-messages',
    'stats-stats'
  ]),
  compositions: expect.arrayContaining([
    {
      name: 'credits-balance',
      components: ['credits-balance'],
      image: expect.stringMatching(/^[^/]+\/dummies\/composition-credits-balance:[a-z\d]+/)
    },
    {
      name: 'dummies-a',
      components: ['dummies-a'],
      image: expect.stringMatching(/^[^/]+\/dummies\/composition-dummies-a:[a-z\d]+/)
    },
    {
      name: 'messages',
      components: ['messages-messages', 'stats-stats'],
      image: expect.stringMatching(/^[^/]+\/dummies\/composition-messages:[a-z\d]+/)
    }
  ]),
  services: expect.arrayContaining([
    {
      name: 'exposition-resources',
      image: expect.stringMatching(/^[^/]+\/dummies\/service-exposition-resources:[a-z\d]+/),
      port: 8000,
      ingress: {
        host: expect.any(String),
        class: expect.any(String),
        annotations: expect.any(Object)
      }
    }
  ]),
  proxies: [
    {
      name: 'storages-mongodb-dummies-a',
      target: 'is-not-defined'
    },
    {
      name: 'storages-mongodb-credits-balance',
      target: 'is-not-defined'
    },
    {
      name: 'storages-mongodb-messages-messages',
      target: 'is-not-defined'
    },
    {
      name: 'storages-mongodb-stats-stats',
      target: 'is-not-defined'
    }
  ],
  rabbitmq: {
    fullnameOverride: 'rabbitmq',
    auth: {
      username: expect.any(String),
      password: expect.any(String),
      erlangCookie: expect.any(String)
    }
  }
}

exports.chart = chart
exports.values = values
