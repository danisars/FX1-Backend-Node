export default function () {
  let env;
  switch (process.env.APP_ENV) {
    case 'develop':
      env = 'api.dev.fx1';
      break;
    case 'staging':
      env = 'api.staging.fx1';
      break;
    default:
      env = 'api.fx1';
      break;
  }
  return env;
}
