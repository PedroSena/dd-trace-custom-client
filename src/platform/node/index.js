"use strict"
const EventEmitter = require("events")
const id = require("./id")
const now = require("./now")
const env = require("./env")
/* sumeet */
// const load = require('./load')
const load = () => {
  // console.warn("platform.load called")
}
/* sumeet END */
const service = require("./service")
const request = require("./request")
const msgpack = require("./msgpack")
const emitter = new EventEmitter()
const platform = {
  _config: {},
  name: () => /*sumeet*/ /*'nodejs'*/ "client-js" /*sumeet END*/,
  version: () => /*sumeet*/ /*process.version */ "latest" /*sumeet END*/,
  engine: () => /*sumeet*/ /*process.jsEngine ||*/ "v8"/*sumeet END*/,
  configure (config) {
    this._config = config
  },
  id,
  now,
  env,
  load,
  service,
  request,
  msgpack,
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.removeListener.bind(emitter)
}
/* sumeet - not allowed in RN*/
try {
  process.once("beforeExit", () => emitter.emit("exit"))
}
catch (e) {
  // ignore
}
module.exports = platform
