"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FolderUp,
  Files,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useAdminLang } from "@/components/admin/AdminLanguage";

export interface UploadedFileItem {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

interface BulkImageUploaderProps {
  onUploadSuccess: (items: UploadedFileItem[]) => void;
  title?: string;
  description?: string;
}

export function BulkImageUploader({
  onUploadSuccess,
  title: titleProp,
  description: descriptionProp,
}: BulkImageUploaderProps) {
  const { t } = useAdminLang();
  const title = titleProp === undefined ? t("Unggah Banyak Gambar Sekaligus", "Upload Multiple Images at Once") : titleProp;
  const description =
    descriptionProp === undefined
      ? t(
          "Pilih beberapa file sekaligus atau pilih satu folder dari komputer Anda.",
          "Choose several files at once or pick a folder from your computer."
        )
      : descriptionProp;
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles: File[] = [];
    const validExtensions = /\.(jpg|jpeg|png|webp|svg)$/i;

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (validExtensions.test(f.name)) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage(t("Tidak ada file gambar valid (JPG, PNG, WEBP, SVG) yang ditemukan.", "No valid image files (JPG, PNG, WEBP, SVG) were found."));
      return;
    }

    setErrorMessage("");
    setSelectedFiles((prev) => {
      // Hindari duplikasi
      const names = new Set(prev.map((p) => p.name + p.size));
      const newlyAdded = validFiles.filter((f) => !names.has(f.name + f.size));
      return [...prev, ...newlyAdded];
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setErrorMessage("");
    setSuccessCount(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      setUploadProgress(40);
      const res = await fetch("/api/admin/cms/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);
      const json = await res.json();

      if (res.ok && json.success && json.data?.files) {
        setUploadProgress(100);
        setSuccessCount(json.data.files.length);
        setSelectedFiles([]);
        onUploadSuccess(json.data.files);
      } else {
        setErrorMessage(json.message || t("Gagal mengunggah file.", "Failed to upload files."));
      }
    } catch (err) {
      console.error("Bulk upload error:", err);
      setErrorMessage(t("Terjadi kesalahan jaringan saat mengunggah banyak file.", "A network error occurred while uploading the files."));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header Bulk Uploader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Files className="h-4 w-4 text-blue-600" />
            <span>{title}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>

        {/* Tombol Input File & Folder */}
        <div className="flex items-center gap-2">
          {/* Input Multiple File */}
          <input
            ref={filesInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => handleFilesSelect(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => filesInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{t("Pilih Banyak File", "Choose Multiple Files")}</span>
          </button>

          {/* Input Folder Directory Upload */}
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory is standard in modern browsers
            webkitdirectory=""
            directory=""
            multiple
            onChange={(e) => handleFilesSelect(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-700 transition-colors disabled:opacity-50"
          >
            <FolderUp className="h-3.5 w-3.5" />
            <span>{t("Pilih Satu Folder", "Choose a Folder")}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesSelect(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50/60"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
        }`}
      >
        <p className="text-xs font-medium text-slate-600">
          {t("Atau seret dan lepaskan banyak file gambar langsung ke kotak ini.", "Or drag and drop multiple image files straight into this box.")}
        </p>
      </div>

      {/* Pesan Sukses / Error */}
      {successCount !== null && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            {t(
              `Berhasil mengunggah dan menambahkan ${successCount} item gambar baru!`,
              `Successfully uploaded and added ${successCount} new image ${successCount === 1 ? "item" : "items"}!`
            )}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preview Antrean File Terpilih */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {t(
                `Antrean Unggah: ${selectedFiles.length} file gambar`,
                `Upload Queue: ${selectedFiles.length} image ${selectedFiles.length === 1 ? "file" : "files"}`
              )}
            </span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              className="text-slate-400 hover:text-slate-700 text-[11px]"
            >
              {t("Bersihkan Antrean", "Clear Queue")}
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-100">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 px-2 text-xs">
                <div className="flex items-center gap-2 truncate max-w-[80%]">
                  <ImageIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Progress Bar jika sedang upload */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{t("Mengunggah file ke server...", "Uploading files to the server...")}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tombol Eksekusi Upload */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleStartUpload}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isUploading ? "animate-spin" : ""}`} />
              <span>
                {isUploading
                  ? t("Memproses Unggahan...", "Processing Upload...")
                  : t(`Mulai Unggah ${selectedFiles.length} File`, `Start Uploading ${selectedFiles.length} ${selectedFiles.length === 1 ? "File" : "Files"}`)}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default BulkImageUploader;
