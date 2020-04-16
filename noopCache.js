class NoopCache {
  constrctor() { }

  async get(_key) {
    return null;
  }

  async put(_key, _value) {
    return;
  }

  async invalidate(_key) {
    return;
  }
}

module.exports = NoopCache;
