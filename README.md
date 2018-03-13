> quickfix-middleware

an express middleware built for getting fixtures up in a quick and flexible manner.

[![Build Status](https://travis-ci.org/pearofducks/quickfixture-middleware.svg?branch=master)](https://travis-ci.org/pearofducks/quickfixture-middleware)

#### example

```javascript
const express = require('express');
const quickfixtureMiddleware = require('quickfixtureMiddleware');

const app = express();
app.use(quickfixtureMiddleware('./fixtures'));
```
