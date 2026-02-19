'use client';

import React, { useEffect, useRef } from 'react';
import setupQuill from '@/lib/quilljs';

type QuillEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function QuillEditor({ value = '', onChange, placeholder }: QuillEditorProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<InstanceType<typeof import('quill').default> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Each init cycle gets its own scoped container so stale async
    // cleanups from StrictMode's first mount can't nuke the active mount's DOM.
    const scopeDiv = document.createElement('div');
    wrapper.appendChild(scopeDiv);

    const editorDiv = document.createElement('div');
    scopeDiv.appendChild(editorDiv);

    let quillInstance: InstanceType<typeof import('quill').default> | null = null;

    setupQuill(editorDiv, { placeholder }).then((quill) => {
      // If cleanup already ran, just tear down this scope
      if (!wrapper.contains(scopeDiv)) {
        scopeDiv.remove();
        return;
      }

      quillInstance = quill;
      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }

      quill.on('text-change', () => {
        onChangeRef.current?.(quill.root.innerHTML);
      });
    });

    return () => {
      if (quillInstance) {
        try { quillInstance.off('text-change'); } catch { /* ignore */ }
      }
      quillRef.current = null;
      // Remove only THIS cycle's scoped container — safe even if async hasn't resolved yet
      scopeDiv.remove();
    };
    // eslint-disable-next-line
  }, [placeholder]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="quill-editor" ref={wrapperRef} />
  );
}