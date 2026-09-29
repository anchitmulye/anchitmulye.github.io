const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 1005;

app.use(express.static(path.join(__dirname, 'docs')));

app.listen(PORT, () => console.log(`\n  Portfolio running at http://localhost:${PORT}\n`));