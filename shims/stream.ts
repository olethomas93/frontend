// Minimal browser shim for the Node.js 'stream' module.
// sax.js (used by xml-js) only needs stream.Stream as an EventEmitter-like
// base class. This stub satisfies that import without pulling in Node internals.
export class Stream {
  on (_event: string, _listener: (...args: any[]) => void) { return this }
  emit (_event: string, ..._args: any[]) { return false }
  removeListener (_event: string, _listener: (...args: any[]) => void) { return this }
}

export default { Stream }
