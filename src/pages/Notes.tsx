import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Code2,
  Folder,
  Star,
  Edit3,
  Trash2,
  Check,
  ChevronsUpDown,
  ExternalLink,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/useNotes";
import { useFavorites } from "@/hooks/useFavorites";
import { useProgress } from "@/hooks/useProgress";
import { PROBLEMS } from "@/lib/problems/problemLibrary";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { NoteEditor } from "@/components/notes/NoteEditor";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,

} from "@/components/ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Notes() {
  const navigate = useNavigate();
  const { notes, loading: notesLoading, deleteNote, saveNote } = useNotes();
  const { isFavorite } = useFavorites();
  const { progress } = useProgress();

  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [openProblemSelect, setOpenProblemSelect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UI State
  const [isListVisible, setIsListVisible] = useState(true);

  // Enhance notes with problem data
  const enhancedNotes = useMemo(() => notes.map(note => {
    const problem = PROBLEMS.find(p => p.id === note.problem_id);
    return {
      ...note,
      title: problem ? problem.title : "Unknown Problem",
      // Excerpt is less relevant with HTML content, but we can try to strip tags or just show raw
      excerpt: note.content.replace(/<[^>]*>/g, ' ').slice(0, 100) + "...",
      linkedProblem: problem ? problem.title : null,
      linkedTopic: problem?.tags?.[0] || "General",
      tags: problem?.tags || [],
      starred: isFavorite(note.problem_id),
      updatedAt: formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    };
  }), [notes, isFavorite]);

  const filteredNotes = enhancedNotes.filter((note) => {
    if (selectedFolder === "starred") return note.starred;
    if (selectedFolder === "patterns") return note.tags.some(t => t.toLowerCase().includes("pattern"));
    return true;
  }).filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = selectedNoteId ? enhancedNotes.find(n => n.id === selectedNoteId) : null;

  const folders = [
    { id: "all", name: "All Notes", count: enhancedNotes.length },
    { id: "starred", name: "Starred", count: enhancedNotes.filter(n => n.starred).length },
    { id: "patterns", name: "Patterns", count: enhancedNotes.filter(n => n.tags.some(t => t.toLowerCase().includes("pattern"))).length },
  ];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setSelectedNoteId(null);
    setSelectedProblemId(null);
  };

  const handleSaveNewNote = async (content: string) => {
    if (!selectedProblemId) {
      toast.error("Please select a problem first");
      return;
    }
    setIsSaving(true);
    const newNote = await saveNote(selectedProblemId, content);
    setIsSaving(false);

    if (newNote) {
      setIsCreating(false);
      setSelectedNoteId(newNote.id);
      toast.success("Note saved successfully");
    } else {
      toast.error("Failed to save note");
    }
  };

  const handleUpdateNote = async (content: string) => {
    if (!selectedNote) return;
    setIsSaving(true);
    const updated = await saveNote(selectedNote.problem_id, content);
    setIsSaving(false);
    if (updated) {
      toast.success("Note updated");
    }
  };

  const handleAiRequest = async (currentContent: string) => {
    // Determine context: selectedNote or creating new note
    const problemId = selectedNote ? selectedNote.problem_id : selectedProblemId;
    if (!problemId) {
      toast.error("Please select a problem for context");
      return;
    }

    const problem = PROBLEMS.find(p => p.id === problemId);
    const userProgress = progress[problemId];
    const userCode = userProgress?.code || "";

    try {
      const { data, error } = await supabase.functions.invoke("debug-code", {
        body: {
          code: userCode, // Pass user's code for context
          // Construct a prompt for the AI
          userQuestion: `I am writing a note about the problem "${problem?.title}".
              
              My Code:
              ${userCode}
              
              My Note Draft:
              ${currentContent}
              
              Task: Please continue this note or suggest improvements. Focus on key learnings, time complexity, and edge cases I might have missed. Keep it brief and in a helpful tone.`,
          problemContext: `Problem: ${problem?.title}\nDescription: ${problem?.description}`,
        },
      });

      if (error) throw error;

      return data?.analysis ? `\n\n**AI Suggestion:**\n${data.analysis}` : undefined;

    } catch (err) {
      console.error("AI Error:", err);
      toast.error("Failed to get AI suggestion");
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Folders */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-56 border-r border-sidebar-border bg-card p-4 hidden md:block shrink-0"
      >
        <Button className="w-full mb-4" onClick={handleStartCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>

        <nav className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => {
                setSelectedFolder(folder.id);
                setIsCreating(false);
                setSelectedNoteId(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                selectedFolder === folder.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                {folder.id === "starred" ? (
                  <Star className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}
                <span>{folder.name}</span>
              </div>
              <span className="text-xs">{folder.count}</span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Notes List - Collapsible */}
      <AnimatePresence initial={false} mode="wait">
        {isListVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-r border-sidebar-border flex flex-col bg-background shrink-0 overflow-hidden"
          >
            {/* Search */}
            <div className="p-4 border-b border-sidebar-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex-1 overflow-auto min-w-[320px]">
              {notesLoading ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Loading notes...</div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">No notes found. Create a new one!</div>
              ) : (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsCreating(false);
                    }}
                    className={cn(
                      "w-full border-b border-sidebar-border p-4 text-left transition-colors",
                      selectedNoteId === note.id
                        ? "bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                      {note.starred && <Star className="h-3 w-3 text-warning fill-warning" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {note.excerpt || "No content"}
                    </p>
                    <div className="flex items-center gap-2">
                      {note.linkedProblem && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                          <Code2 className="mr-1 h-3 w-3" />
                          {note.linkedProblem.slice(0, 15)}
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">{note.updatedAt}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Content / Editor */}
      <motion.div
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col bg-background/50 h-full overflow-hidden"
      >
        {isCreating ? (
          <div className="flex flex-col h-full">
            <div className="border-b border-sidebar-border p-4 bg-background flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => setIsListVisible(!isListVisible)}
                title={isListVisible ? "Collapse List" : "Expand List"}
              >
                <PanelLeft className={cn("h-4 w-4 transition-transform", !isListVisible && "rotate-180")} />
              </Button>
              <h2 className="text-lg font-semibold">Create New Note</h2>
            </div>

            <div className="p-4 pb-0">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Problem</label>
                <Popover open={openProblemSelect} onOpenChange={setOpenProblemSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProblemSelect}
                      className="w-full justify-between"
                    >
                      {selectedProblemId
                        ? PROBLEMS.find((p) => p.id === selectedProblemId)?.title
                        : "Select problem..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search problem..." />
                      <CommandList>
                        <CommandEmpty>No problem found.</CommandEmpty>
                        <CommandGroup>
                          {PROBLEMS.map((problem) => (
                            <CommandItem
                              key={problem.id}
                              value={problem.title}
                              onSelect={() => {
                                setSelectedProblemId(problem.id === selectedProblemId ? null : problem.id);
                                setOpenProblemSelect(false);
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProblemId === problem.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span>{problem.title}</span>
                                <Badge variant="outline" className="ml-auto text-xs">{problem.difficulty}</Badge>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <NoteEditor
                onSave={handleSaveNewNote}
                onCancel={() => setIsCreating(false)}
                onRequestAi={handleAiRequest}
                isSaving={isSaving}
              />
            </div>
          </div>
        ) : selectedNote ? (
          <div className="flex flex-col h-full">
            {/* Note Header */}
            <div className="flex items-center justify-between border-b border-sidebar-border p-4 bg-background">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  onClick={() => setIsListVisible(!isListVisible)}
                  title={isListVisible ? "Collapse List" : "Expand List"}
                >
                  <PanelLeft className={cn("h-4 w-4 transition-transform", !isListVisible && "rotate-180")} />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">{selectedNote.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedNote.linkedTopic && (
                      <Badge variant="info">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        {selectedNote.linkedTopic}
                      </Badge>
                    )}
                    {selectedNote.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/practice?id=${selectedNote.problem_id}`)}>
                  Solve Problem <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={(e) => handleDelete(e, selectedNote.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {/* View/Edit Mode */}
            {/* Using NoteEditor for both viewing and editing (updates on save) */}
            <div className="flex-1 p-4 overflow-hidden">
              <NoteEditor
                key={selectedNote.id} // Re-mount when note changes
                content={selectedNote.content}
                onSave={handleUpdateNote}
                onRequestAi={handleAiRequest}
                isSaving={isSaving}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Empty State Header with Toggle */}
            <div className="border-b border-sidebar-border p-4 bg-background flex justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => setIsListVisible(!isListVisible)}
                title={isListVisible ? "Collapse List" : "Expand List"}
              >
                <PanelLeft className={cn("h-4 w-4 transition-transform", !isListVisible && "rotate-180")} />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a note to view or create a new one</p>
                <Button variant="link" onClick={handleStartCreate}>Create Note</Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
