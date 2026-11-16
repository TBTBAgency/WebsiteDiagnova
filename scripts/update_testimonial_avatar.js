const fs = require('fs');
let c = fs.readFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', 'utf-8');
const oldT = '<form onSubmit={handleSaveTestimonial} className="space-y-4">';
const newT = `<form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <ImageUploader
                  value={editingTestimonial.avatarUrl || ""}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatarUrl: url })}
                  label="Foto Profil Dokter / Avatar Mitra"
                  placeholder="Pilih atau seret foto profil dari komputer"
                  aspectRatio="square"
                />
              </div>`;

if (!c.includes('Foto Profil Dokter / Avatar Mitra')) {
  c = c.replace(oldT, newT);
  fs.writeFileSync('app/admin/(dashboard)/cms/homepage/page.tsx', c, 'utf-8');
  console.log('Added avatar ImageUploader to Testimonial modal');
} else {
  console.log('Already added');
}

