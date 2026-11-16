const fs = require('fs');

let fileContent = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');

// 1. Add imports if not present
if (!fileContent.includes('ImageUploader')) {
  fileContent = fileContent.replace(
    '  ShieldAlert,\n} from "lucide-react";',
    '  ShieldAlert,\n  Upload,\n} from "lucide-react";\nimport ImageUploader from "@/components/admin/ImageUploader";\nimport BulkImageUploader from "@/components/admin/BulkImageUploader";'
  );
  console.log('Added ImageUploader and BulkImageUploader imports');
}

// 2. Add handleBulkPartnerUpload and handleBulkTestimonialUpload handlers
if (!fileContent.includes('handleBulkPartnerUpload')) {
  const handlerCode = `
  const handleBulkPartnerUpload = async (files: { url: string; originalName: string; sizeBytes: number }[]) => {
    setIsSaving(true);
    try {
      let count = 0;
      for (const file of files) {
        const cleanName = file.originalName
          .replace(/\\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\\b\\w/g, (char) => char.toUpperCase());

        const res = await fetch("/api/admin/cms/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "partner",
            action: "save",
            data: {
              name: cleanName || "Mitra Baru",
              logoUrl: file.url,
              sortOrder: (cmsData?.trustedBy?.partners?.length || 0) + count + 1,
              isActive: true,
            },
          }),
        });
        if (res.ok) count++;
      }
      showToast(\`Berhasil menambahkan \${count} logo mitra dari unggahan massal.\`);
      await loadCmsData();
    } catch (err) {
      showToast("Gagal memproses batch logo mitra.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkTestimonialUpload = async (files: { url: string; originalName: string; sizeBytes: number }[]) => {
    setIsSaving(true);
    try {
      let count = 0;
      for (const file of files) {
        const cleanName = file.originalName
          .replace(/\\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\\b\\w/g, (char) => char.toUpperCase());

        const res = await fetch("/api/admin/cms/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "testimonial",
            action: "save",
            data: {
              name: \`dr. \${cleanName}\`,
              roleId: "Spesialis Patologi Klinik",
              roleEn: "Clinical Pathology Specialist",
              institution: "Laboratorium Rujukan",
              quoteId: "Platform Diagnova mempermudah efisiensi dan keakuratan pelaporan hasil laboratorium kami.",
              quoteEn: "Diagnova platform greatly improves our laboratory workflow efficiency and precision.",
              avatarUrl: file.url,
              rating: 5,
              sortOrder: (cmsData?.testimonials?.items?.length || 0) + count + 1,
              isActive: true,
            },
          }),
        });
        if (res.ok) count++;
      }
      showToast(\`Berhasil membuat \${count} draf testimonial dari foto yang diunggah.\`);
      await loadCmsData();
    } catch (err) {
      showToast("Gagal memproses foto testimonial.", "error");
    } finally {
      setIsSaving(false);
    }
  };
`;
  fileContent = fileContent.replace('  // Partner Handlers', handlerCode + '\n  // Partner Handlers');
  console.log('Added bulk handlers');
}

// 3. Trusted By Tab: add BulkImageUploader
const trustedByTarget = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">`;
const bulkPartnerUI = `            {/* Bulk & Folder Upload for Partner Logos */}
            <div className="mb-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-[#087BEE]" />
                  <span>Unggah Cepat Massal / Folder Logo Mitra</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Unggah beberapa file logo sekaligus atau pilih satu folder komputer. Setiap file otomatis terdaftar sebagai mitra.
                </p>
              </div>
              <BulkImageUploader
                onUploadComplete={handleBulkPartnerUpload}
                label="Pilih Banyak Logo Mitra / Drag Folder ke Sini"
                acceptDirectory={true}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">`;

if (fileContent.includes(trustedByTarget) && !fileContent.includes('Unggah Cepat Massal / Folder Logo Mitra')) {
  fileContent = fileContent.replace(trustedByTarget, bulkPartnerUI);
  console.log('Added BulkImageUploader to Trusted By tab');
}

// 4. Testimonials Tab: add BulkImageUploader
const testimonialsTarget = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">`;
const bulkTestimonialUI = `            {/* Bulk Avatar Upload */}
            <div className="mb-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-[#087BEE]" />
                  <span>Unggah Massal Foto Profil / Avatar Dokter</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Unggah banyak foto dokter atau pilih folder foto. Sistem otomatis membuat draf testimonial siap edit.
                </p>
              </div>
              <BulkImageUploader
                onUploadComplete={handleBulkTestimonialUpload}
                label="Pilih Foto Dokter / Drag Folder ke Sini"
                acceptDirectory={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">`;

if (fileContent.includes(testimonialsTarget) && !fileContent.includes('Unggah Massal Foto Profil / Avatar Dokter')) {
  fileContent = fileContent.replace(testimonialsTarget, bulkTestimonialUI);
  console.log('Added BulkImageUploader to Testimonials tab');
}

// 5. About Tab: add ImageUploader
const aboutTarget = `              <p className="mt-1 text-[11px] text-slate-400">
                Tip: Teks ini akan dipecah otomatis per-spasi untuk menghasilkan efek pewarnaan bertahap saat pengguna scroll halaman.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paragraf Penjelas ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>`;

const aboutReplacement = `              <p className="mt-1 text-[11px] text-slate-400">
                Tip: Teks ini akan dipecah otomatis per-spasi untuk menghasilkan efek pewarnaan bertahap saat pengguna scroll halaman.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paragraf Penjelas ({editorLang === "ID" ? "Indonesia" : "English"})
              </label>`;

// Add ImageUploader at the end of About form
const aboutEndTarget = `              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COMPARISON */}`;

const aboutEndReplacement = `              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <ImageUploader
                value={sectionForms["about"]?.extraContent?.imageUrl || ""}
                onChange={(url) => handleExtraContentChange("about", "imageUrl", url)}
                label="Gambar Ilustrasi Tentang Diagnova (Opsional)"
                placeholder="Pilih atau seret gambar ilustrasi untuk mengganti animasi DNA default"
                aspectRatio="video"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COMPARISON */}`;

if (fileContent.includes(aboutEndTarget)) {
  fileContent = fileContent.replace(aboutEndTarget, aboutEndReplacement);
  console.log('Added ImageUploader to About tab');
}

// 6. CTA Tab: add ImageUploader
const ctaEndTarget = `              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT / CREATE HERO SLIDE */}`;

const ctaEndReplacement = `              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <ImageUploader
                value={sectionForms["cta"]?.extraContent?.imageUrl || ""}
                onChange={(url) => handleExtraContentChange("cta", "imageUrl", url)}
                label="Gambar Mockup Banner CTA (Opsional, Default Laptop Mockup)"
                placeholder="Pilih atau seret gambar banner platform Diagnova dari komputer"
                aspectRatio="video"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT / CREATE HERO SLIDE */}`;

if (fileContent.includes(ctaEndTarget)) {
  fileContent = fileContent.replace(ctaEndTarget, ctaEndReplacement);
  console.log('Added ImageUploader to CTA tab');
}

// 7. Modal 1: Hero Slide ImageUploader
const heroSlideOldImage = `                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Gambar Background
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.imageUrl || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, imageUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>`;

const heroSlideNewImage = `                <div className="col-span-2">
                  <ImageUploader
                    value={editingSlide.imageUrl || ""}
                    onChange={(url) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                    label="Gambar Background Slide Hero *"
                    placeholder="Pilih atau seret gambar banner (16:9) dari komputer"
                    aspectRatio="video"
                  />
                </div>`;

if (fileContent.includes(heroSlideOldImage)) {
  fileContent = fileContent.replace(heroSlideOldImage, heroSlideNewImage);
  console.log('Replaced Hero Slide manual URL input with ImageUploader');
}

// 8. Modal 2: Testimonial Avatar ImageUploader
const testimonialModalTarget = `                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampil
                  </label>`;

const testimonialModalNew = `              <div>
                <ImageUploader
                  value={editingTestimonial.avatarUrl || ""}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatarUrl: url })}
                  label="Foto Profil Dokter / Avatar Mitra"
                  placeholder="Pilih atau seret foto profil (1:1) dari komputer"
                  aspectRatio="square"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampil
                  </label>`;

// Notice line 1836 in Testimonial modal has institution and rating/sortOrder:
// Let's check exact lines in Testimonial modal
const testModalOld = `              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pemberi Testimoni *
                  </label>`;

const testModalNew = `              <div>
                <ImageUploader
                  value={editingTestimonial.avatarUrl || ""}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatarUrl: url })}
                  label="Foto Profil Dokter / Avatar Mitra"
                  placeholder="Pilih atau seret foto profil (1:1) dari komputer"
                  aspectRatio="square"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pemberi Testimoni *
                  </label>`;

if (fileContent.includes(testModalOld) && !fileContent.includes('Foto Profil Dokter / Avatar Mitra')) {
  fileContent = fileContent.replace(testModalOld, testModalNew);
  console.log('Added ImageUploader to Testimonial modal');
}

// 9. Modal 4: Partner Logo ImageUploader
const partnerOldImage = `              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL File Logo *</label>
                <input
                  type="text"
                  required
                  value={editingPartner.logoUrl || ""}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, logoUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>`;

const partnerNewImage = `              <div>
                <ImageUploader
                  value={editingPartner.logoUrl || ""}
                  onChange={(url) => setEditingPartner({ ...editingPartner, logoUrl: url })}
                  label="Logo Mitra / Rumah Sakit *"
                  placeholder="Upload file SVG atau PNG transparan dari komputer"
                  aspectRatio="square"
                />
              </div>`;

if (fileContent.includes(partnerOldImage)) {
  fileContent = fileContent.replace(partnerOldImage, partnerNewImage);
  console.log('Replaced Partner modal manual URL input with ImageUploader');
}

fs.writeFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', fileContent, 'utf-8');
console.log('Successfully updated app/admin/(dashboard)/cms/homepage/page.tsx');

