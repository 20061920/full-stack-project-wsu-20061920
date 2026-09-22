"use client";

import { useState } from "react";
import styles from "./PostForm.module.css";
import { RichTextEditor } from "./RichTextEditor";
import Link from "next/link";

interface Post {
  id?: string;
  title: string;
  description: string;
  content: string;
  tags: string;
  imageUrl: string;
  category?: string;
  date?: string;
  active?: boolean;
}

interface PostFormProps {
  initialPost?: Post;
  isEdit?: boolean;
}

export function PostForm({ initialPost, isEdit = false }: PostFormProps) {
  const [formData, setFormData] = useState<Post>(
    initialPost || {
      title: "",
      description: "",
      content: "",
      tags: "",
      imageUrl: "",
      category: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be 200 characters or less";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "Tags are required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "Invalid URL format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit ? `/api/posts/${initialPost?.id}` : "/api/posts";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      // Redirect to dashboard
      window.location.href = "/";
    } catch (error) {
      setErrors({ submit: `Failed to save post: ${error instanceof Error ? error.message : "Unknown error"}` });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }; 

  return (
    <main className={styles.formPage}>
      <div className={styles.formContainer}>
        <h1>{isEdit ? "Edit Post" : "Create New Post"}</h1>

      {errors.submit && <div className={styles.errorAlert}>{errors.submit}</div>}

      <form onSubmit={handleSave}>
        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter post title"
            className={errors.title ? styles.inputError : ""}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description">
            Description * ({formData.description.length}/200)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter post description (max 200 characters)"
            maxLength={200}
            rows={3}
            className={errors.description ? styles.inputError : ""}
          />
          {errors.description && (
            <span className={styles.errorText}>{errors.description}</span>
          )}
        </div>

        {/* Content */}
        <div className={styles.formGroup}>
          <label>Content *</label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
            hasError={!!errors.content}
          />
          {errors.content && (
            <span className={styles.errorText}>{errors.content}</span>
          )}
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags (comma-separated) *</label>
          <input
            id="tags"
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., React, JavaScript, Frontend"
            className={errors.tags ? styles.inputError : ""}
          />
          {errors.tags && <span className={styles.errorText}>{errors.tags}</span>}
          {formData.tags && (
            <div className={styles.tagPreview}>
              {formData.tags.split(",").map((tag, i) => (
                <span key={i} className={styles.tagBadge}>
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category *</label>
          <input
            id="category"
            type="text"
            name="category"
            value={formData.category ?? ""}
            onChange={handleInputChange}
            placeholder="e.g., React"
            className={errors.category ? styles.inputError : ""}
          />
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>

        {/* Image URL */}
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image URL *</label>
          <input
            id="imageUrl"
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className={errors.imageUrl ? styles.inputError : ""}
          />
          {errors.imageUrl && (
            <span className={styles.errorText}>{errors.imageUrl}</span>
          )}

          {formData.imageUrl && (
            <div className={styles.imagePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.imageUrl}
                alt="Preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            {isEdit ? "Save" : "Create Post"}
          </button>
          <Link href="/" className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
        </form>
      </div>
    </main>
  );
}
