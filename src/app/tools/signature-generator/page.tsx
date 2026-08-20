import type { Metadata } from "next";
import SignatureGenerator from "./SignatureGenerator";

export const metadata: Metadata = {
  title: "Email Signature Generator | econstruct internal",
  description: "Internal tool for generating a Gmail-ready econstruct email signature.",
  // Internal staff tool — keep it out of search results and AI crawlers.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function SignatureGeneratorPage() {
  return (
    <main className="min-h-screen bg-background">
      <SignatureGenerator />
    </main>
  );
}
