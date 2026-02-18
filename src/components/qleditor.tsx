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
  const quillRef = useRef<InstanceType<typeof import('quill').default> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const wrapper = currentContainer.parentElement;
    // Remove any existing Quill nodes to avoid duplicate toolbars (happens in StrictMode / remounts)
    if (wrapper) {
      wrapper.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
      wrapper.querySelectorAll('.ql-container').forEach((n) => n.remove());
    }
    currentContainer.innerHTML = '';

    // Initialize Quill using your helper (async)
    setupQuill(currentContainer, { placeholder }).then((quill) => {
      if (!isMounted) return;
      quillRef.current = quill;
      const q = quill;

      // Set initial value
      if (value) {
        q.root.innerHTML = value;
      }

      // Listen for changes
      q.on('text-change', () => {
        const html = q.root.innerHTML;
        onChange?.(html);
      });
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (quillRef.current) {
        try {
          if (typeof quillRef.current.off === 'function') {
            quillRef.current.off('text-change');
          }
        } catch {
          // ignore
        }
        quillRef.current = null;
      }
      const wrapperCleanup = currentContainer?.parentElement;
      if (wrapperCleanup) {
        wrapperCleanup.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
        wrapperCleanup.querySelectorAll('.ql-container').forEach((n) => n.remove());
      }
    };
    // eslint-disable-next-line
  }, [containerRef, placeholder]);

  // Sync value prop with Quill content (e.g., for clearing the editor)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        // Only update if the content is actually different to avoid cursor jumping
        // This is crucial when the parent component updates the value while the user is typing
        // But imperative for clearing the editor when value becomes empty
        quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="quill-editor">
      <div ref={containerRef}></div>
    </div>
  );
}