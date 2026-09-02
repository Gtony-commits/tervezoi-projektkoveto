export const createPageCommentsTable = `
  CREATE TABLE IF NOT EXISTS page_comments (
    id TEXT PRIMARY KEY,
    page_key TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    x_percent REAL NOT NULL,
    y_percent REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT
  )
`;

export const createPageCommentsPageIndex = `
  CREATE INDEX IF NOT EXISTS idx_page_comments_page_created
  ON page_comments (page_key, created_at DESC)
`;

export const createPageCommentsCreatedIndex = `
  CREATE INDEX IF NOT EXISTS idx_page_comments_created
  ON page_comments (created_at DESC)
`;
