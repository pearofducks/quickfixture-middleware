> quickfix-middleware

[![Build Status](https://travis-ci.org/pearofducks/quickfixture-middleware.svg?branch=master)](https://travis-ci.org/pearofducks/quickfixture-middleware)

#### example

```javascript
const express = require('express');
const quickfixtureMiddleware = require('quickfixtureMiddleware');

const app = express();
app.use(fixtureMiddleware('./fixtures'));
```
