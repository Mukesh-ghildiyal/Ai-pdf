'use client'

import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import EditorExtension from './EditorExtension'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'


const TextEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit, Underline, Superscript, Subscript,
            Placeholder.configure({
                placeholder: 'Start Taking your notes here ...'
            })
        ],
        // content: '',
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5',
                immediatelyRender: false,
            }
        }
    })
    return (
        <div>
            <EditorExtension editor={editor} />
            <div>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TextEditor
