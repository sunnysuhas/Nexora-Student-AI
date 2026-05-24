import { useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

const colors = {
  cyan: "border-cyan-400/40 bg-cyan-400/10",
  violet: "border-violet-400/40 bg-violet-400/10",
  emerald: "border-emerald-400/40 bg-emerald-400/10",
  amber: "border-amber-400/40 bg-amber-400/10",
};

export function Notes() {
  const { notes, addNote, updateNote, deleteNote, uploadNoteImage } = useAppStore();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const visible = useMemo(
    () =>
      notes.filter((note) =>
        `${note.title} ${note.category} ${note.body}`.toLowerCase().includes(query.toLowerCase())
      ),
    [notes, query]
  );

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (editingId) {
      updateNote(editingId, { title: title.trim(), body: body.trim() });
    } else {
      addNote({ title: title.trim(), body: body.trim(), category: "Quick Note", color: "amber" });
    }
    resetForm();
  };

  return (
    <AppShell title="Notes" eyebrow="Rich Academic Memory">
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">{editingId ? "Edit note" : "Capture note"}</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write a quick academic note..."
              className="min-h-40 w-full rounded-lg border border-slate-300/70 bg-white/70 p-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white dark:placeholder:text-slate-400"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4" />
                {editingId ? "Update Note" : "Save Note"}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full">
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes, categories, topics..." className="pl-11" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((note) => (
              <Card key={note.id} tilt className={`border ${colors[note.color] || colors.cyan}`}>
                <span className="rounded-full bg-white/60 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {note.category}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">{note.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{note.body}</p>
                {!!note.images?.length && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {note.images.map((image) => <img key={image} src={image} alt="" className="h-20 rounded-lg object-cover" />)}
                  </div>
                )}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(note.id);
                      setTitle(note.title);
                      setBody(note.body);
                    }}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-cyan-400/15 px-3 text-xs font-bold text-cyan-700 transition hover:bg-cyan-400/25 dark:text-cyan-300"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-rose-400/15 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-400/25 dark:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
                <label className="mt-2 inline-flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-400/15 px-3 text-xs font-bold text-violet-700 transition hover:bg-violet-400/25 dark:text-violet-300">
                  <ImagePlus className="h-4 w-4" /> Upload Image
                  <input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && uploadNoteImage(note.id, event.target.files[0])} className="hidden" />
                </label>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
