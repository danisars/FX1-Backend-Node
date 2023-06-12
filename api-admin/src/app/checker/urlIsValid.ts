export default function urlIsValid(url: string) {
  const URL = require('url').URL;
  try {
    new URL(url);
    return true;
  } catch (err) {
    throw new Error(`URL is invalid. Input: ${url}.`);
  }
}
