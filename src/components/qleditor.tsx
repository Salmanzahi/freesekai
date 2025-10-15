'use client';

import React, { useEffect, useRef } from 'react';
import setupQuill from '@/lib/quilljs';

type QuillEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function QuillEditor({ value = '', onChange, placeholder }: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (!containerRef.current) return;

    const wrapper = containerRef.current.parentElement;
    // Remove any existing Quill nodes to avoid duplicate toolbars (happens in StrictMode / remounts)
    if (wrapper) {
      wrapper.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
      wrapper.querySelectorAll('.ql-container').forEach((n) => n.remove());
    }
    containerRef.current.innerHTML = '';

    // Initialize Quill using your helper (async)
    setupQuill(containerRef.current, { placeholder }).then((quill) => {
      if (!isMounted) return;
      quillRef.current = quill;

      // Set initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for changes
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange?.(html);
      });
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (quillRef.current) {
        try {
          quillRef.current.off && quillRef.current.off('text-change');
        } catch (e) {
          // ignore
        }
        quillRef.current = null;
      }
      // ensure no stray DOM nodes remain
      const wrapperCleanup = containerRef.current?.parentElement;
      if (wrapperCleanup) {
        wrapperCleanup.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
        wrapperCleanup.querySelectorAll('.ql-container').forEach((n) => n.remove());
      }
    };
    // eslint-disable-next-line
  }, [containerRef, placeholder]);

  return (
    <div className="quill-editor">
      <div ref={containerRef}></div>
    </div>
  );
}