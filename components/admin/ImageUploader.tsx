"use client";

import React, { useState, useRef } from "react";
import { Upload, X, RefreshCw, FolderUp, CheckCircle2, AlertCircle } from "lucide-react";

export interface UploadedFileItem {
  url: string;
  originalName: string;
  sizeBytes: number;
}

export interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: "video" | "square" | "banner";
  required?: boolean;
  allowMultiple?: boolean;
  allowFolder?: boolean;
  onMultiUpload?: (files: UploadedFileItem[]) => void;
}

export function ImageUploader({
  value,
  onChange,
  label = "Unggah Gambar",
  hint = "Format: WEBP, PNG, JPG, SVG (Maks. 10MB)",
  aspectRatio = "video",
  required = false,
  allowMultiple = false,
  allowFolder = false,
  onMultiUpload,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square max-w-[200px]";
      case "banner":
        return "aspect-[21/9] w-full";
      case "video":
      default:
        return "aspect-video w-full";
    }
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/") || f.name.match(/\.(jpg|jpeg|png|webp|svg)$/i)
    );

    if (files.length === 0) {
      setErrorMessage("Format berkas tidak didukung. Harap pilih gambar (JPG, PNG, WEBP, SVG).");
      return;
    }

    // Cek batas ukuran
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        setErrorMessage(`Berkas '${f.name}' melebihi batas 10MB.`);
        return;
      }
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      if (files.length === 1) {
        setUploadProgressText("Mengunggah gambar...");
        formData.append("file", files[0]);
      } else {
        setUploadProgressText(`Mengunggah ${files.length} gambar...`);
        files.forEach((f) => formData.append("files", f));
      }

      const res = await fetch("/api/admin/cms/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.success) {
        if (files.length > 1 && onMultiUpload && json.data?.files) {
          onMultiUpload(
            json.data.files.map((item: any) => ({
              url: item.url,
              originalName: item.originalName,
              sizeBytes: item.sizeBytes,
            }))
          );
        } else if (json.data?.file?.url) {
          onChange(json.data.file.url);
        }
      } else {
        setErrorMessage(json.message || "Gagal mengunggah gambar.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Terjadi kendala jaringan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-1.5 text-xs">
      {label && (
        <label className="font-semibold text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {hint && <span className="text-[10px] font-normal text-slate-400">{hint}</span>}
        </label>
      )}

      {/* Hidden standard file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={allowMultiple}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Hidden folder input */}
      {allowFolder && (
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error webkitdirectory standard
          webkitdirectory=""
          directory=""
          multiple
          onChange={onFolderInputChange}
          className="hidden"
        />
      )}

      {value ? (
        // Preview Gambar yang Dipilih
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className={`relative ${getAspectClass()} flex items-center justify-center overflow-hidden`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            {/* Overlay Action Buttons */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold shadow-md hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isUploading ? "animate-spin" : ""}`} />
                <span>Ganti Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={isUploading}
                className="p-1.5 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                title="Hapus Gambar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="truncate max-w-[80%]">{value}</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1 font-sans shrink-0">
              <CheckCircle2 className="h-3 w-3" />
              <span>Terpilih</span>
            </span>
          </div>
        </div>
      ) : (
        // Dropzone Unggah Gambar
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/60 scale-[1.01]"
              : "border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-blue-600">
              {isUploading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-xs">
                {isUploading
                  ? uploadProgressText || "Mengunggah gambar..."
                  : "Seret gambar ke sini atau gunakan tombol di bawah"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {allowMultiple
                  ? "Dapat memilih 1 file atau banyak file sekaligus dari perangkat"
                  : "Mendukung file langsung dari komputer/laptop Anda"}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                <span>{allowMultiple ? "Pilih Berkas Gambar" : "Pilih Gambar"}</span>
              </button>

              {allowFolder && (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => folderInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <FolderUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pilih Folder</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
