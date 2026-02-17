

'use client';
import type { QuillOptions } from 'quill';


// Optionally import Quill modules and themes
export type QuillSetupOptions = {
    theme?: string;
    modules?: QuillOptions['modules'];
    placeholder?: string;
    readOnly?: boolean;
};

export default async function setupQuill(
    container: string | HTMLElement,
    options: QuillSetupOptions = {}
): Promise<InstanceType<typeof import('quill').default>> {
    const Quill = (await import('quill')).default;
    await import('quill/dist/quill.snow.css');
    const quill = new Quill(container, {
        theme: options.theme || 'snow',
        modules: options.modules || {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block'],
            ],
        },
        placeholder: options.placeholder || 'Compose an epic...',
        readOnly: options.readOnly || false,
    });
    return quill;
}