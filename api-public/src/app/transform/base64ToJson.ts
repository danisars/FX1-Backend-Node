export default function (content: string) {
  const buffer = Buffer.from(content, 'base64');
  return JSON.parse(buffer!.toString());
}
