import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";

export async function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <ProgressBar />
      <Header />
      <main className="flex-grow pt-4 pb-24 md:pb-12">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
