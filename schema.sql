CREATE TABLE emails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_email TEXT NOT NULL,
    to_email TEXT NOT NULL,
    subject TEXT,
    text_content TEXT,
    html_content TEXT,
    attachments JSONB,
    spam_flag BOOLEAN DEFAULT FALSE, -- TRUE if flagged as spam
    spam_score FLOAT,               -- Spam score (numeric)
    created_at TIMESTAMP DEFAULT NOW()
);
