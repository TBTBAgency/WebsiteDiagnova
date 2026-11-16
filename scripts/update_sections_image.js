const fs = require('fs');

// 1. AboutSection.tsx
let about = fs.readFileSync('components/sections/AboutSection.tsx', 'utf-8');
if (!about.includes('const aboutImage =')) {
  about = about.replace(
    '  const { language } = useLanguage();',
    '  const { language } = useLanguage();\n  const aboutImage = initialData?.section?.extraContent?.imageUrl || "/images/dna-about.webp";'
  );
  about = about.replace('src="/images/dna-about.webp"', 'src={aboutImage}');
  fs.writeFileSync('components/sections/AboutSection.tsx', about, 'utf-8');
  console.log('Updated AboutSection.tsx');
} else {
  console.log('AboutSection.tsx already updated');
}

// 2. CTABanner.tsx
let cta = fs.readFileSync('components/sections/CTABanner.tsx', 'utf-8');
if (!cta.includes('const ctaImage =')) {
  cta = cta.replace(
    '  const { language } = useLanguage();',
    '  const { language } = useLanguage();\n  const ctaImage = initialData?.section?.extraContent?.imageUrl || "/images/CTA-image.webp";'
  );
  cta = cta.replace('src="/images/CTA-image.webp"', 'src={ctaImage}');
  fs.writeFileSync('components/sections/CTABanner.tsx', cta, 'utf-8');
  console.log('Updated CTABanner.tsx');
} else {
  console.log('CTABanner.tsx already updated');
}

