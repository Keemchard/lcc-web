"use client";

import { FC, useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import styles from "./ImageUpload.module.scss";

type Props = {
  currentImageUrl?: string;
  onFileSelected: (file: File) => void;
};

const ImageUpload: FC<Props> = ({ currentImageUrl, onFileSelected }) => {
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <div className={styles.previewWrapper}>
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={200}
            className={styles.preview}
          />
          <p className={styles.changeText}>Click or drag to replace</p>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <p>Drop an image here or click to upload</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className={styles.hiddenInput}
      />
    </div>
  );
};

export default ImageUpload;
