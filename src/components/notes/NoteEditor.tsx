import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Code,
    Undo,
    Redo,
    Sparkles,
    CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { marked } from "marked";

interface NoteEditorProps {
    content?: string;
    onSave?: (content: string) => void;
    onCancel?: () => void;
    onRequestAi?: (currentContent: string) => Promise<string | void>;
    isSaving?: boolean;
    readOnly?: boolean;
}

export function NoteEditor({ content = "", onSave, onCancel, onRequestAi, isSaving = false, readOnly = false }: NoteEditorProps) {
    const [isAiLoading, setIsAiLoading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write your note here...",
            }),
            Typography,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content,
        editable: !readOnly,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm sm:prose-base prose-invert focus:outline-none max-w-none px-4 py-3 font-sans prose-pre:bg-secondary prose-pre:text-secondary-foreground",
                    !readOnly && "min-h-[300px]"
                ),
            },
        },
    });

    if (!editor) {
        return null;
    }

    const handleAiClick = async () => {
        if (!onRequestAi) return;
        setIsAiLoading(true);
        const currentText = editor.getText();
        const suggestion = await onRequestAi(currentText);

        if (suggestion) {
            try {
                const htmlSuggestion = await marked.parse(suggestion);
                editor.chain().focus().insertContent(htmlSuggestion).run();
            } catch (error) {
                console.error("Failed to parse AI suggestion:", error);
                editor.chain().focus().insertContent(suggestion).run();
            }
        }
        setIsAiLoading(false);
    };

    return (
        <div className={cn("flex flex-col border rounded-md overflow-hidden bg-background w-full h-full", readOnly && "border-none")}>
            {/* Toolbar */}
            {!readOnly && (
                <div className="flex items-center gap-1 border-b bg-muted/40 p-1 flex-wrap">
                    {onRequestAi && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAiClick}
                                disabled={isAiLoading}
                                className="h-8 px-2 text-violet-500 hover:text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                            >
                                <Sparkles className={cn("h-4 w-4 mr-1", isAiLoading && "animate-pulse")} />
                                {isAiLoading ? "Thinking..." : "AI Suggest"}
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-4 bg-border mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-4 bg-border mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("bulletList") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("orderedList") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("taskList") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <CheckSquare className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-4 bg-border mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("codeBlock") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Code className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={cn("h-8 w-8 p-0", editor.isActive("blockquote") ? "bg-muted text-foreground" : "text-muted-foreground")}
                    >
                        <Quote className="h-4 w-4" />
                    </Button>

                    <div className="flex-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="h-8 w-8 p-0 text-muted-foreground"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="h-8 w-8 p-0 text-muted-foreground"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Editor Content */}
            <div className="flex-1 overflow-auto">
                <EditorContent editor={editor} />
            </div>

            {/* Footer Actions */}
            {!readOnly && onSave && (
                <div className="border-t p-3 flex justify-end gap-2 bg-muted/20">
                    {onCancel && (
                        <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={() => onSave(editor.getHTML())} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Note"}
                    </Button>
                </div>
            )}
        </div>
    );
}
