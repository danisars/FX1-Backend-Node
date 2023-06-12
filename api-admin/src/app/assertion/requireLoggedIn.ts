import assert from 'assert';

export default function (uid?: string | null) {
  // assert(uid !== undefined && uid !== null, 'You must be logged in.');
  assert(uid !== undefined && uid !== null, 'Sorry, you must be logged in');
}
