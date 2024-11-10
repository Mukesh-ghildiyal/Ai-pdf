import { chatSession } from '@/configs/AIModel'
import { api } from '@/convex/_generated/api'
import { useAction } from 'convex/react'
import { Bold, Italic, Sparkle, Subscript, Superscript, Underline } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const EditorExtension = ({ editor }) => {
    const { fileId } = useParams()
    const searchAI = useAction(api.myActions.search)
    // console.log(SearchAI)

    const onAiClick = async () => {

        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' ',
        )


        const result = await searchAI({
            query: selectedText,
            fileId: fileId,
        })



        console.log("Unformatted Answer:", result)

        const UnformatedAns = JSON.parse(result)
        if (UnformatedAns && UnformatedAns.length > 0) {
            let AllUnformatedAns = UnformatedAns.map(item => item.pageContent).join(' ')
            const PROMPT = `For question: "${selectedText}" and with the given content as answer, please give an appropriate answer in HTML format. The answer content is: ${AllUnformatedAns}.`

            const AiModelResult = await chatSession.sendMessage(PROMPT)
            console.log("AI Model Response:", await AiModelResult.response.text())

            const FinalAns = AiModelResult.response.text().replace('```', '').replace('html', '')
            const AllText = editor.getHTML();
            editor.commands.setContent(AllText + '<p> <strong>Answer:</strong>' + FinalAns + '</p>')
        }
    }



    return editor && (
        <div className='p-3 '>
            <div className="control-group">
                <div className="button-group flex gap-3">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'text-blue-500' : ''}
                    >
                        <Bold />
                    </button>

                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'text-blue-500' : ''}
                    >
                        <Italic />
                    </button>

                    <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'text-blue-500' : ''}
                    >
                        <Underline />
                    </button>

                    <button
                        onClick={() => editor?.chain().focus().toggleSubscript().run()}
                        className={editor.isActive('subscript') ? 'text-blue-500' : ''}
                    >
                        <Subscript />
                    </button>

                    <button
                        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                        className={editor.isActive('superscript') ? 'text-blue-500' : ''}
                    >
                        <Superscript />
                    </button>

                    <button
                        onClick={() => onAiClick()}
                        className={'hover:text-blue-500'}
                    >
                        <Sparkle />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditorExtension
