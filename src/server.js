const { createApp } = require('./app');
const port = process.env.PORT || 4101;
createApp().listen(port, () => console.log('acme-svc-payments listening on ' + port));
