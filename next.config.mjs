/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/platform/workflow",
        destination: "/platform#workflow",
        permanent: false,
      },
      {
        source: "/platform/automation",
        destination: "/platform#automation",
        permanent: false,
      },
      {
        source: "/platform/reporting",
        destination: "/platform#reporting",
        permanent: false,
      },
      {
        source: "/platform/analytics",
        destination: "/platform#analytics",
        permanent: false,
      },
      {
        source: "/solutions/hospital-laboratory",
        destination: "/solutions#hospital-laboratory",
        permanent: false,
      },
      {
        source: "/solutions/clinical-laboratory",
        destination: "/solutions#clinical-laboratory",
        permanent: false,
      },
      {
        source: "/solutions/pathology",
        destination: "/solutions#pathology",
        permanent: false,
      },
      {
        source: "/solutions/microbiology",
        destination: "/solutions#microbiology",
        permanent: false,
      },
      {
        source: "/solutions/blood-bank",
        destination: "/solutions#blood-bank",
        permanent: false,
      },
      {
        source: "/solutions/nova-ai",
        destination: "/solutions#nova-ai",
        permanent: false,
      },
      {
        source: "/modules/routine-hematology",
        destination: "/modules#routine-hematology",
        permanent: false,
      },
      {
        source: "/modules/blood-bank",
        destination: "/modules#blood-bank",
        permanent: false,
      },
      {
        source: "/modules/inventory-reagent",
        destination: "/modules#inventory-reagent",
        permanent: false,
      },
      {
        source: "/modules/pathology",
        destination: "/modules#pathology",
        permanent: false,
      },
      {
        source: "/modules/microbiology",
        destination: "/modules#microbiology",
        permanent: false,
      },
      {
        source: "/nova-ai/how-it-works",
        destination: "/nova-ai#how-it-works",
        permanent: false,
      },
      {
        source: "/nova-ai/ai-doctor",
        destination: "/nova-ai#ai-doctor",
        permanent: false,
      },
      {
        source: "/integration/simrs-his",
        destination: "/integration#simrs-his",
        permanent: false,
      },
      {
        source: "/integration/rme",
        destination: "/integration#rme",
        permanent: false,
      },
      {
        source: "/integration/analyzer",
        destination: "/integration#analyzer",
        permanent: false,
      },
      {
        source: "/integration/satusehat",
        destination: "/integration#satusehat",
        permanent: false,
      },
      {
        source: "/integration/connectivity",
        destination: "/integration#connectivity",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
