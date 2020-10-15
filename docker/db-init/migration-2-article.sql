CREATE TABLE IF NOT EXISTS article (
    id SERIAL NOT NULL,
    title VARCHAR(255) NOT NULL,
    article_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL  DEFAULT NOW(),
    CONSTRAINT article_pkey PRIMARY KEY (id)
);
