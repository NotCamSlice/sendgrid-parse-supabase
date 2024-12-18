export const config = {
  runtime: 'edge',
};

export default function handler(): Response {
  return new Response('GTAPoliceMods API Running!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
