'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquarePlus,
  MousePointer2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type StoredPageComment = {
  id: string;
  page_key: string;
  author_name: string;
  body: string;
  x_percent: number;
  y_percent: number;
  created_at: string;
  updated_at: string | null;
};

type Point = { x: number; y: number };

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function PageComments({
  pageKey,
  children,
}: {
  pageKey: string;
  children: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<StoredPageComment[]>([]);
  const [commentMode, setCommentMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<Point | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [editingComment, setEditingComment] =
    useState<StoredPageComment | null>(null);
  const [deletingComment, setDeletingComment] =
    useState<StoredPageComment | null>(null);
  const [editAuthor, setEditAuthor] = useState('');
  const [editBody, setEditBody] = useState('');
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    const savedName = window.sessionStorage.getItem('demo-comment-author');
    if (savedName) setAuthorName(savedName);
    fetch('/api/comments', { cache: 'no-store' })
      .then(async (response) => {
        const data = (await response.json()) as {
          comments?: StoredPageComment[];
          error?: string;
        };
        if (!response.ok) throw new Error(data.error || 'Betöltési hiba.');
        setComments(data.comments ?? []);
      })
      .catch((caught: unknown) =>
        setError(
          caught instanceof Error
            ? caught.message
            : 'A kommentek betöltése sikertelen.',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const visibleComments = useMemo(
    () => comments.filter((comment) => comment.page_key === pageKey),
    [comments, pageKey],
  );

  const placeComment = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!commentMode || !canvasRef.current) return;
    const target = event.target as HTMLElement;
    if (target.closest('[data-comment-control]')) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPendingPoint({
      x: Math.min(
        99,
        Math.max(1, ((event.clientX - rect.left) / rect.width) * 100),
      ),
      y: Math.min(
        99,
        Math.max(1, ((event.clientY - rect.top) / rect.height) * 100),
      ),
    });
    setCommentMode(false);
    setError('');
  };

  const saveComment = async () => {
    if (!pendingPoint || authorName.trim().length < 2 || !body.trim()) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey,
          authorName: authorName.trim(),
          body: body.trim(),
          xPercent: pendingPoint.x,
          yPercent: pendingPoint.y,
        }),
      });
      const data = (await response.json()) as {
        comment?: StoredPageComment;
        error?: string;
      };
      if (!response.ok || !data.comment) {
        throw new Error(data.error || 'A komment mentése sikertelen.');
      }
      window.sessionStorage.setItem('demo-comment-author', authorName.trim());
      setComments((current) => [data.comment!, ...current]);
      setBody('');
      setPendingPoint(null);
      setPanelOpen(true);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'A komment mentése sikertelen.',
      );
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (comment: StoredPageComment) => {
    setEditingComment(comment);
    setEditAuthor(comment.author_name);
    setEditBody(comment.body);
    setError('');
  };

  const updateComment = async () => {
    if (!editingComment || editAuthor.trim().length < 2 || !editBody.trim())
      return;
    setMutating(true);
    setError('');
    try {
      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingComment.id,
          authorName: editAuthor.trim(),
          body: editBody.trim(),
        }),
      });
      const data = (await response.json()) as {
        comment?: Pick<
          StoredPageComment,
          'id' | 'author_name' | 'body' | 'updated_at'
        >;
        error?: string;
      };
      if (!response.ok || !data.comment) {
        throw new Error(data.error || 'A komment szerkesztése sikertelen.');
      }
      setComments((current) =>
        current.map((comment) =>
          comment.id === data.comment!.id
            ? { ...comment, ...data.comment }
            : comment,
        ),
      );
      setEditingComment(null);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'A komment szerkesztése sikertelen.',
      );
    } finally {
      setMutating(false);
    }
  };

  const deleteComment = async () => {
    if (!deletingComment) return;
    setMutating(true);
    setError('');
    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingComment.id }),
      });
      const data = (await response.json()) as {
        deleted?: boolean;
        error?: string;
      };
      if (!response.ok || !data.deleted) {
        throw new Error(data.error || 'A komment törlése sikertelen.');
      }
      setComments((current) =>
        current.filter((comment) => comment.id !== deletingComment.id),
      );
      setDeletingComment(null);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'A komment törlése sikertelen.',
      );
    } finally {
      setMutating(false);
    }
  };

  return (
    <div
      ref={canvasRef}
      onClick={placeComment}
      className={`relative min-h-screen ${commentMode ? 'cursor-crosshair' : ''}`}
    >
      {children}

      {visibleComments.map((comment, index) => (
        <button
          key={comment.id}
          type="button"
          data-comment-control
          onClick={(event) => {
            event.stopPropagation();
            setPanelOpen(true);
          }}
          className="absolute z-40 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-background bg-amber-300 text-[10px] font-black text-slate-950 shadow-[0_6px_20px_rgb(0_0_0/45%)] transition-transform hover:scale-110"
          style={{
            left: `${comment.x_percent}%`,
            top: `${comment.y_percent}%`,
          }}
          title={`${comment.author_name}: ${comment.body}`}
          aria-label={`${index + 1}. komment megnyitása`}
        >
          {index + 1}
        </button>
      ))}

      {commentMode && (
        <div
          data-comment-control
          className="fixed left-1/2 top-20 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-300/40 bg-slate-950/95 px-4 py-2 text-xs font-bold text-amber-200 shadow-2xl backdrop-blur"
        >
          <MousePointer2 className="size-4" />
          Kattints oda, ahová a kommentet szeretnéd
          <button
            onClick={(event) => {
              event.stopPropagation();
              setCommentMode(false);
            }}
            className="ml-1 rounded-full p-1 hover:bg-white/10"
            aria-label="Komment mód bezárása"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div
        data-comment-control
        className="fixed bottom-5 right-4 z-[65] flex items-center gap-2 sm:right-6"
      >
        <Button
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            setPanelOpen((open) => !open);
          }}
          className="bg-popover shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" /> : <MapPin />}
          {visibleComments.length} komment
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            setCommentMode((active) => !active);
            setPanelOpen(false);
          }}
          className={
            commentMode ? 'bg-amber-300 text-slate-950 hover:bg-amber-200' : ''
          }
        >
          <MessageSquarePlus />
          Komment mód
        </Button>
      </div>

      {panelOpen && (
        <aside
          data-comment-control
          className="fixed bottom-20 right-4 z-[64] flex max-h-[min(620px,70vh)] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl sm:right-6"
        >
          <div className="flex items-start justify-between border-b border-border p-4">
            <div>
              <h2 className="text-sm font-black">Oldalkommentek</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Ezen a nézeten · tartósan mentve
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPanelOpen(false)}
              aria-label="Kommentlista bezárása"
            >
              <X />
            </Button>
          </div>
          <div className="overflow-y-auto p-3 nina-scroll">
            {loading && (
              <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Betöltés…
              </div>
            )}
            {!loading && visibleComments.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <MessageSquarePlus className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-xs font-bold">Még nincs komment</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Kapcsold be a komment módot, majd kattints az oldalra.
                </p>
              </div>
            )}
            <div className="space-y-2">
              {visibleComments.map((comment, index) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-300 text-[9px] font-black text-slate-950">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-xs font-bold">
                          {comment.author_name}
                        </p>
                        <time className="text-[9px] text-muted-foreground">
                          {formattedDate(comment.created_at)}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/85">
                        {comment.body}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2">
                        <span className="text-[9px] text-muted-foreground">
                          {comment.updated_at ? 'Szerkesztve' : 'Eredeti'}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => openEdit(comment)}
                          >
                            <Pencil /> Szerkesztés
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setDeletingComment(comment)}
                            className="text-red-300 hover:text-red-200"
                          >
                            <Trash2 /> Törlés
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      )}

      <Dialog
        open={Boolean(pendingPoint)}
        onOpenChange={(open) => {
          if (!open && !saving) setPendingPoint(null);
        }}
      >
        <DialogContent
          data-comment-control
          className="sm:max-w-md"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <span className="grid size-8 place-items-center rounded-full bg-amber-300 text-slate-950">
                <MapPin className="size-4" />
              </span>
              Új oldalkomment
            </DialogTitle>
            <DialogDescription>
              A megjegyzés ezen a ponton jelenik meg, és mindenki számára
              megmarad a demóban.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <label className="grid gap-1.5 text-xs font-bold">
              Név
              <Input
                autoFocus
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="pl. Tesztelő 01"
                maxLength={60}
                className="h-10 font-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold">
              Komment
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Mit változtatnál ezen a részen?"
                maxLength={1200}
                className="min-h-28 font-normal"
              />
            </label>
            {error && (
              <p className="text-xs font-semibold text-red-300">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingPoint(null)}
              disabled={saving}
            >
              Mégse
            </Button>
            <Button
              onClick={saveComment}
              disabled={saving || authorName.trim().length < 2 || !body.trim()}
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MessageSquarePlus />
              )}
              Mentés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingComment)}
        onOpenChange={(open) => {
          if (!open && !mutating) setEditingComment(null);
        }}
      >
        <DialogContent data-comment-control className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Komment szerkesztése
            </DialogTitle>
            <DialogDescription>
              A módosítás mentés után minden látogatónál frissül.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <label className="grid gap-1.5 text-xs font-bold">
              Név
              <Input
                value={editAuthor}
                onChange={(event) => setEditAuthor(event.target.value)}
                maxLength={60}
                className="h-10 font-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold">
              Komment
              <Textarea
                value={editBody}
                onChange={(event) => setEditBody(event.target.value)}
                maxLength={1200}
                className="min-h-28 font-normal"
              />
            </label>
            {error && (
              <p className="text-xs font-semibold text-red-300">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingComment(null)}
              disabled={mutating}
            >
              Mégse
            </Button>
            <Button
              onClick={updateComment}
              disabled={
                mutating || editAuthor.trim().length < 2 || !editBody.trim()
              }
            >
              {mutating ? <Loader2 className="animate-spin" /> : <Pencil />}
              Változtatások mentése
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletingComment)}
        onOpenChange={(open) => {
          if (!open && !mutating) setDeletingComment(null);
        }}
      >
        <AlertDialogContent data-comment-control>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törlöd a kommentet?</AlertDialogTitle>
            <AlertDialogDescription>
              Ez a művelet nem vonható vissza, a komment minden látogatónál
              eltűnik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p className="text-xs font-semibold text-red-300">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutating}>Mégse</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteComment}
              disabled={mutating}
              className="bg-red-500 text-white hover:bg-red-400"
            >
              {mutating ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Végleges törlés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {savedNotice && (
        <div
          data-comment-control
          role="status"
          className="fixed bottom-20 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-primary/30 bg-popover px-4 py-3 text-sm font-semibold shadow-2xl"
        >
          <CheckCircle2 className="size-4 text-primary" />
          A komment elmentve.
        </div>
      )}
    </div>
  );
}
