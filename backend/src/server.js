const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(
    `Nexus CRM backend listening on port ${config.port}`
  );
});
