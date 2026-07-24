import CompleteSignIn from "./CompleteSignIn";

// Deliberately does NOT process the magic-link code on load — see
// CompleteSignIn.tsx / actions.ts for why (email security scanners
// pre-fetch links and would otherwise burn the one-time code).
export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;
  return <CompleteSignIn code={code} initialError={error} />;
}
