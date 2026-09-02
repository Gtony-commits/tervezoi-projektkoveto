import { ensureCommentsSchema, type PageCommentRow } from '@/lib/comments-db';

export const dynamic = 'force-dynamic';

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET() {
  try {
    const db = await ensureCommentsSchema();
    const result = await db
      .prepare(
        `SELECT id, page_key, author_name, body, x_percent, y_percent, created_at, updated_at
         FROM page_comments
         ORDER BY created_at DESC
         LIMIT 250`,
      )
      .all<PageCommentRow>();
    return json({ comments: result.results });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'A kommentek betöltése sikertelen.',
      },
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const pageKey = String(input.pageKey ?? '').trim();
    const authorName = String(input.authorName ?? '').trim();
    const body = String(input.body ?? '').trim();
    const xPercent = Number(input.xPercent);
    const yPercent = Number(input.yPercent);

    if (!pageKey || pageKey.length > 160) {
      return json({ error: 'Érvénytelen oldalhivatkozás.' }, 400);
    }
    if (authorName.length < 2 || authorName.length > 60) {
      return json({ error: 'A név 2–60 karakter hosszú lehet.' }, 400);
    }
    if (!body || body.length > 1200) {
      return json({ error: 'A komment 1–1200 karakter hosszú lehet.' }, 400);
    }
    if (
      !Number.isFinite(xPercent) ||
      !Number.isFinite(yPercent) ||
      xPercent < 0 ||
      xPercent > 100 ||
      yPercent < 0 ||
      yPercent > 100
    ) {
      return json({ error: 'Érvénytelen kommentpozíció.' }, 400);
    }

    const comment: PageCommentRow = {
      id: crypto.randomUUID(),
      page_key: pageKey,
      author_name: authorName,
      body,
      x_percent: xPercent,
      y_percent: yPercent,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    const db = await ensureCommentsSchema();
    await db
      .prepare(
        `INSERT INTO page_comments
          (id, page_key, author_name, body, x_percent, y_percent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        comment.id,
        comment.page_key,
        comment.author_name,
        comment.body,
        comment.x_percent,
        comment.y_percent,
        comment.created_at,
      )
      .run();

    return json({ comment }, 201);
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'A komment mentése sikertelen.',
      },
      500,
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const id = String(input.id ?? '').trim();
    const authorName = String(input.authorName ?? '').trim();
    const body = String(input.body ?? '').trim();

    if (!id || id.length > 80)
      return json({ error: 'Érvénytelen komment.' }, 400);
    if (authorName.length < 2 || authorName.length > 60) {
      return json({ error: 'A név 2–60 karakter hosszú lehet.' }, 400);
    }
    if (!body || body.length > 1200) {
      return json({ error: 'A komment 1–1200 karakter hosszú lehet.' }, 400);
    }

    const updatedAt = new Date().toISOString();
    const db = await ensureCommentsSchema();
    const result = await db
      .prepare(
        `UPDATE page_comments
         SET author_name = ?, body = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(authorName, body, updatedAt, id)
      .run();
    if (!result.meta.changes)
      return json({ error: 'A komment nem található.' }, 404);

    return json({
      comment: { id, author_name: authorName, body, updated_at: updatedAt },
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'A komment szerkesztése sikertelen.',
      },
      500,
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const id = String(input.id ?? '').trim();
    if (!id || id.length > 80)
      return json({ error: 'Érvénytelen komment.' }, 400);

    const db = await ensureCommentsSchema();
    const result = await db
      .prepare('DELETE FROM page_comments WHERE id = ?')
      .bind(id)
      .run();
    if (!result.meta.changes)
      return json({ error: 'A komment nem található.' }, 404);
    return json({ deleted: true });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'A komment törlése sikertelen.',
      },
      500,
    );
  }
}
