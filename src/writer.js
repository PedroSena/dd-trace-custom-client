"use strict"
const platform = require("./platform")
const log = require("./log")
const format = require("./format")
const encode = require("./encode")
const tracerVersion = require("../lib/version")
/* sumeet - add decode */
const msgpack = require("msgpack-lite")
const postAsJson = true

/*sumeet END*/
class Writer {
  constructor (url, size) {
    this._queue = []
    this._url = url
    this._size = size
  }

  get length () {
    return this._queue.length
  }

  append (span) {
    const trace = span.context().trace
    if (trace.started.length === trace.finished.length) {
      const formattedTrace = trace.finished.map(format)
      log.debug(() => `Encoding trace: ${JSON.stringify(formattedTrace)}`)
      const buffer = encode(formattedTrace)
      /* sumeet */
      /*   log.debug(() => `Adding encoded trace to buffer: ${buffer.toString("hex")
       .match(/../g)
       .join(" ")}`)*/
      if (this.length < this._size) {
        this._queue.push(buffer)
      }
      else {
        this._squeeze(buffer)
      }
    }
  }

  flush () {
    if (this._queue.length > 0) {

      /*const data = platform.msgpack.prefix(this._queue)*/
      /* sumeet - changed const to let so we can modify it lower down*/
      let data = platform.msgpack.prefix(this._queue)
      //
      const options = {
        //protocol: this._url.protocol,
        //hostname: this._url.hostname,
        /* sumeet ensure 443 is appended - gets dropped in react!*/
        //port: this._url.port ? this._url.port : (this._url.protocol == "https:" || this._url.protocol == "https" ? "443" : "80"),
        //path: "/v0.3/traces",
        url: `${this._url.href}/v0.3/traces`,
        method: "PUT",
        headers: {
          "Content-Type": "application/msgpack",
          "Datadog-Meta-Lang": platform.name(),
          "Datadog-Meta-Lang-Version": platform.version(),
          "Datadog-Meta-Lang-Interpreter": platform.engine(),
          "Datadog-Meta-Tracer-Version": tracerVersion,
          "X-Datadog-Trace-Count": String(this._queue.length)
        }
      }
      /* try posting as JSON*/
      if (postAsJson) {
        let arrData = []
        this._queue.forEach((value, index) => {
          // decode byte arrays back to string
          arrData.push(msgpack.decode(value))
        })
        // stringify
        data = JSON.stringify(arrData)
        options.headers["Accept"] = "*"
        options.headers["Content-Type"] = "application/json"
        options.headers["Content-Length"] = data.length
        options.withCredentials = false
        log.debug(() => `Data for Request to the dd-trace agent : at url ${this._url.href}: ${data}`)
      }
      /* sumeet end*/
      log.debug(() => `Request to the dd-trace agent: ${JSON.stringify(options)}`)
      platform
        .request(Object.assign({data}, options))
        .then(res => {
          log.debug(`Response from the dd-trace agent: status ${res.status} ok: ${res.ok} `)
        })
        .catch(e => {
          log.error(`ERROR from the dd-trace agent:  ${e}`)
        })
      this._queue = []
    }
  }

  _squeeze (buffer) {
    const index = Math.floor(Math.random() * this.length)
    this._queue[index] = buffer
  }
}

module.exports = Writer

