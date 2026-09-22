import React from "react";
import { Metadata } from "next";
import { Eye, BrainCircuit, Zap, UserCheck, ShieldAlert } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { novaAIWorkflowSteps, novaAIDisclaimer } from "@/content/nova-ai";
import { ProcessStepCard } from "@/components/ui/ProcessStepCard";

export const metadata: Metadata = {
  title: "Cara Kerja Nova AI — 4 Tahap Analisis Cerdas",
  description:
    "Pelajari 4 tahapan alur kerja Nova AI: Observe, Understand, Assist, dan Decide.",
};

const iconMap: Record<string, React.ReactNode> = {
  Eye: <Eye className="h-5 w-5" />,
  BrainCircuit: <BrainCircuit className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  UserCheck: <UserCheck className="h-5 w-5" />,
};

export default function NovaAIHowItWorksPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Nova AI Workflow</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            4 Tahap Cara Kerja Nova AI
          </h1>
          <p className="text-slate-200">
            Alur terstruktur yang menjamin akurasi analisis tanpa melewati pengawasan dokter.
          </p>
        </div>
      </section>

      {/* Mandatory Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center text-xs text-amber-900 font-medium">
        <ShieldAlert className="inline h-4 w-4 mr-1 text-amber-700" />
        {novaAIDisclaimer.text}
      </div>

      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {novaAIWorkflowSteps.map((step) => (
            <ProcessStepCard
              key={step.step}
              number={step.step}
              subtitle={`${step.phase} • ${step.subtitle}`}
              title={step.title}
              description={step.description}
              icon={iconMap[step.iconName]}
              theme="light"
            />
          ))}
        </div>

        <div className="text-center pt-6">
          <Button href="/request-demo" variant="primary" size="lg">
            Coba Simulasi Nova AI
          </Button>
        </div>
      </section>
    </div>
  );
}
