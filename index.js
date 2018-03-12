const fs = require('fs');
const promisify = require('util').promisify;
const access = promisify(fs.access);
const stat = promisify(fs.stat);
const path = require('path');
const debug = require('debug')('quickfixture-middleware');

module.exports = quickfixtureMiddleware;

// Transform the url into an equivalent filename
// Example: GET /api/books -> api--books.json
// Example: GET /api/books?foo=bar -> api--books__foo=bar.json
function defaultMatcher({req, fixturesDir}) {
  if (req.method !== 'GET') return
  const fixtureBasename = req.url
    .substr(1)
    .replace(/\//g, '--')
    .replace(/\?/g, '__');
  const desiredFixtureName = `${fixtureBasename}.json`
  const fixtureFiles = fs.readdirSync(fixturesDir);
  const result = fixtureFiles.find(f => f === desiredFixtureName)
  if (result) return path.join(fixturesDir, result)
}

function quickfixtureMiddleware(directory, matcherFunction=defaultMatcher) {
  debug('Using fixture directory:', directory);

  if (!directory || typeof directory !== 'string') {
    throw new TypeError('Fixture path required and must be a string');
  }
  if (!fs.existsSync(directory)) {
    throw new Error('Fixture directory specified ' + directory + ' does not exist');
  }

  return async function quickfixtureMiddleware(req, res, next) {

    let fixture = matcherFunction({ req, fixturesDir: directory })

    if (!fixture) return next()

    debug('Responding with fixture:', fixture);

    if (typeof fixture === 'object') return res.json(fixture);

    try {
      await access(fixture);
      const fixtureStat = await stat(fixture);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': fixtureStat.size,
      });
      fs.createReadStream(fixture).pipe(res);
    } catch (error) {
      debug('ERROR when accessing fixture file:', error.message);
      return next();
    }
  };
}
