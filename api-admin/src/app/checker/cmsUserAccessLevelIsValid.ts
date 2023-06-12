const availableAccessLevel = ['Super User', 'Admin', 'Editor'];

export default function (accessLevel: string) {
  if (!availableAccessLevel.includes(accessLevel)) {
    throw new Error('Access Level is invalid.');
  }
}
