const fs = require('fs');
const path = require('path');
const config = require('./config');

const scans = new Map(); // insertion order = chronological
if (config.persistFile && fs.existsSync(config.persistFile)) {
  try { JSON.parse(fs.readFileSync(config.persistFile, 'utf8')).forEach((s) => scans.set(s.id, s)); } catch { /* ignore corrupt file */ }
}

function persist() {
  if (!config.persistFile) return;
  fs.mkdirSync(path.dirname(config.persistFile), { recursive: true });
  fs.writeFileSync(config.persistFile, JSON.stringify([...scans.values()]));
}

module.exports = {
  save(scan) {
    scans.set(scan.id, scan);
    while (scans.size > config.maxScans) scans.delete(scans.keys().next().value);
    persist();
    return scan;
  },
  get(id, ownerId) {
    if (id === 'latest') {
      return [...scans.values()].reverse().find((scan) => scan.ownerId === ownerId);
    }
    const scan = scans.get(id);
    return scan?.ownerId === ownerId ? scan : undefined;
  },
  list(ownerId) { return [...scans.values()].filter((scan) => scan.ownerId === ownerId).reverse(); },
  remove(id, ownerId) {
    if (!this.get(id, ownerId)) return false;
    scans.delete(id);
    persist();
    return true;
  },
};
