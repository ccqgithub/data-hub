export default function logMiddleware(payload, pipeName) {
  console.log(`pipe: ${pipeName}`);
  console.log(payload);
  return payload;
}
