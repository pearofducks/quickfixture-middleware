const test = require('ava')
const express = require('express')
const request = require('supertest')
const quickfixtureMiddleware = require('./index.js')

test.beforeEach(t => {
  t.context.server = express()
})

test('it loads', t => {
  const instance = quickfixtureMiddleware('./fixtures')
  t.is(typeof(t.context.server.use(instance)),'function')
})
test("it throws an error if the fixture directory is not specified", t => {
  const error = t.throws(() => quickfixtureMiddleware(), TypeError)
  t.is(error.message, 'Fixture path required and must be a string')
})
test("it throws an error if the fixture directory is not a string", t => {
  const error = t.throws(() => quickfixtureMiddleware({ directory: 'fixtures' }), TypeError)
  t.is(error.message, 'Fixture path required and must be a string')
})
test("it throws an error if the fixture directory is not found", t => {
  const error = t.throws(() => quickfixtureMiddleware('./foo'), Error)
  t.is(error.message, 'Fixture directory specified ./foo does not exist')
})
test('it can GET a fixture using the default function', async t => {
  const instance = quickfixtureMiddleware('./fixtures')
  t.context.server.use(instance)

  const res = await request(t.context.server)
    .get('/foo/bar?baz=buz')
  t.is(res.status, 200)
  t.deepEqual(res.body, { "success": true })
})
test('it ignores POSTs using default function', async t => {
  const instance = quickfixtureMiddleware('./fixtures')
  t.context.server.use(instance)
  t.context.server.post('/post-test', (req, res, next) => res.sendStatus(418))

  const getRes = await request(t.context.server)
    .get('/post-test')
  t.is(getRes.status, 404)
  const postRes = await request(t.context.server)
    .post('/post-test')
  t.is(postRes.status, 418)
})
