"use client";

import React from "react";

// Exact SVG icons from the provided design specification
function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 2 4 13.5h6.2L9 22l10-12.2h-6.4L13.5 2Z" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.6 2.5c.5 3-1.2 4.6-2.7 6.1C8.4 10 7 11.500 7 14.200 7 17.400 9.200 20 12.200 20c3 0 5.300-2.400 5.300-5.600 0-2-.9-3.500-2-4.800-.3 1-.9 1.700-1.700 2 .4-3.200-.3-6.400-1.200-9.100Z" />
    </svg>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function SwapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 8h14l-3-3M20 16H6l3 3" />
    </svg>
  );
}

function DesktopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5Z" />
    </svg>
  );
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0H5Zm6 7.900V22h2v-3.100h-2Z" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.600 3h3l1.200 4.500-2 1.300a11 11 0 0 0 5.400 5.400l1.300-2L20 13.400v3A3.500 3.500 0 0 1 16.500 20 13.500 13.500 0 0 1 3 6.500 3.500 3.500 0 0 1 6.600 3Z" />
    </svg>
  );
}

function BarsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="4" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="4" width="4" height="16" rx="1" />
      <rect x="16" y="9" width="4" height="11" rx="1" />
    </svg>
  );
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="2" y="6" width="14" height="12" rx="2.500" />
      <path d="m17 10.500 5-3v9l-5-3v-3Z" />
    </svg>
  );
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5 3h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5v3h3v2H7v-2h3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function RouteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 12a8 8 0 0 1-13.700 5.600M4 12A8 8 0 0 1 17.700 6.400" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </svg>
  );
}

interface FeatureItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}

interface PlanItem {
  id: string;
  name: string;
  tag: string;
  accentClass: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  price: string;
  billingPeriod: string;
  infoTitle: string;
  featureTitle: string;
  features: FeatureItem[];
}

const plansData: PlanItem[] = [
  {
    id: "core",
    name: "Core",
    tag: "Ideal for startups & small companies",
    accentClass: "plan-core",
    icon: BoltIcon,
    description: "All the essential tools your teams need to operate a best-in-class.",
    price: "$19",
    billingPeriod: "/user/mo",
    infoTitle: "Billed annually, per user",
    featureTitle: "Core includes:",
    features: [
      { icon: SwapIcon, text: "Blended inbound/outbound" },
      { icon: DesktopIcon, text: "Agent desktop plus" },
      { icon: PinIcon, text: "Geo redundancy" },
      { icon: MicIcon, text: "Call recording" },
      { icon: PhoneIcon, text: "Business phone service" },
    ],
  },
  {
    id: "adv",
    name: "Advanced",
    tag: "Ideal for enterprise companies",
    accentClass: "plan-adv",
    icon: FlameIcon,
    description: "Deliver an exceptional customer experience across various channels.",
    price: "$34",
    billingPeriod: "/user/mo",
    infoTitle: "Billed annually, per user",
    featureTitle: "Everything in Core, plus:",
    features: [
      { icon: BarsIcon, text: "Advanced reporting" },
      { icon: ChatIcon, text: "24/7 chat support" },
      { icon: VideoIcon, text: "Video meetings" },
      { icon: ShareIcon, text: "Screenshare & file share" },
      { icon: RouteIcon, text: "Call routing" },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="pricing-wrapper">
      <style>{`
        .pricing-wrapper {
          --bg: #F4F4F2;
          --card: #FFFFFF;
          --line: #ECECEA;
          --text: #111827;
          --muted: #6B7280;
          --icon: #8A909B;
          --cta: #1E2A8A;
          --cta-text: #FFFFFF;
          --core: #2F4BDB;
          --core-tint: #E4E7FB;
          --core-ink: #1E2A8A;
          --adv: #7C3AED;
          --adv-tint: #EDE3FB;
          --adv-ink: #5B21B6;

          width: 100%;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: grid;
          place-items: center;
          padding: 48px 20px;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }

        @media (prefers-color-scheme: dark) {
          .pricing-wrapper:not([data-theme="light"]) {
            --bg: #0F1014;
            --card: #1A1B21;
            --line: #2B2D35;
            --text: #F3F4F6;
            --muted: #A1A7B3;
            --icon: #8B91A0;
            --cta: #4C5BE0;
            --core: #7C8CFF;
            --core-tint: #23274D;
            --core-ink: #C9D0FF;
            --adv: #B28CFF;
            --adv-tint: #2E2248;
            --adv-ink: #DCC9FF;
          }
        }

        .pricing-plans {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 420px));
          gap: 12px;
          justify-content: center;
          width: 100%;
          max-width: 900px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        @media (max-width: 760px) {
          .pricing-plans {
            grid-template-columns: minmax(0, 420px);
          }
        }

        .pricing-plan {
          --tint: var(--core-tint);
          --ink: var(--core-ink);
          --accent: var(--core);
          position: relative;
          padding: 38px 6px 6px;
          border-radius: 30px;
          background: transparent;
          transition: background-color 0.22s ease;
        }

        .pricing-plan.plan-adv {
          --tint: var(--adv-tint);
          --ink: var(--adv-ink);
          --accent: var(--adv);
        }

        .pricing-tag {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.22s ease, transform 0.22s ease;
          pointer-events: none;
        }

        .pricing-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 28px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .pricing-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .pricing-head svg {
          width: 18px;
          height: 18px;
          color: var(--accent);
          flex-shrink: 0;
        }

        .pricing-desc {
          margin: 10px 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: var(--muted);
          max-width: 30ch;
        }

        .pricing-hr {
          border: 0;
          border-top: 1px solid var(--line);
          margin: 20px 0;
        }

        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .pricing-price strong {
          font-size: 44px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .pricing-price span {
          font-size: 12px;
          color: var(--muted);
        }

        .pricing-price button.pricing-info-btn {
          all: unset;
          display: inline-flex;
          cursor: help;
          color: var(--icon);
          border-radius: 50%;
          transform: translateY(1px);
        }

        .pricing-price button.pricing-info-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .pricing-price .pricing-info-btn svg {
          width: 13px;
          height: 13px;
        }

        .pricing-cta {
          margin-top: 20px;
          width: 100%;
          height: 48px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--text);
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, gap 0.2s ease;
        }

        .pricing-cta svg {
          width: 0;
          height: 14px;
          opacity: 0;
          transition: width 0.2s ease, opacity 0.2s ease;
        }

        .pricing-cta:focus-visible {
          outline: 2px solid var(--cta);
          outline-offset: 3px;
        }

        .pricing-list-title {
          font-size: 12.5px;
          font-weight: 600;
          margin: 0 0 14px;
        }

        ul.pricing-features {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 12px;
        }

        ul.pricing-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--muted);
        }

        ul.pricing-features svg {
          width: 15px;
          height: 15px;
          flex: none;
          color: var(--icon);
        }

        /* Hover & keyboard active state: identical smooth response without jumps */
        .pricing-plan:hover,
        .pricing-plan:focus-within {
          background: var(--tint);
        }

        .pricing-plan:hover .pricing-tag,
        .pricing-plan:focus-within .pricing-tag {
          opacity: 1;
          transform: translateY(0);
        }

        .pricing-plan:hover .pricing-cta,
        .pricing-plan:focus-within .pricing-cta {
          background: var(--cta);
          border-color: var(--cta);
          color: var(--cta-text);
          gap: 8px;
        }

        .pricing-plan:hover .pricing-cta svg,
        .pricing-plan:focus-within .pricing-cta svg {
          width: 14px;
          opacity: 1;
        }

        @media (hover: none) {
          .pricing-plan {
            background: var(--tint);
          }
          .pricing-tag {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pricing-wrapper * {
            transition: none !important;
          }
        }
      `}</style>

      <main className="w-full">
        <ul className="pricing-plans">
          {plansData.map((plan) => (
            <li key={plan.id} className={`pricing-plan ${plan.accentClass}`}>
              <div className="pricing-tag">{plan.tag}</div>
              <article className="pricing-card" aria-labelledby={`${plan.id}-title`}>
                <div className="pricing-head">
                  <plan.icon />
                  <h2 id={`${plan.id}-title`} style={{ margin: 0, font: "inherit" }}>
                    {plan.name}
                  </h2>
                </div>
                <p className="pricing-desc">{plan.description}</p>
                <div className="pricing-hr" />
                <div className="pricing-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.billingPeriod}</span>
                  <button
                    className="pricing-info-btn"
                    type="button"
                    aria-label={plan.infoTitle}
                    title={plan.infoTitle}
                  >
                    <InfoIcon />
                  </button>
                </div>
                <button className="pricing-cta" type="button">
                  <span>Talk to an expert</span>
                  <ArrowIcon />
                </button>
                <div className="pricing-hr" />
                <p className="pricing-list-title">{plan.featureTitle}</p>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <feature.icon />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
