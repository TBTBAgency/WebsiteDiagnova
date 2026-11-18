import { AdminLanguageProvider } from "@/components/admin/AdminLanguage";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLanguageProvider>{children}</AdminLanguageProvider>;
}
