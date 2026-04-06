CREATE TABLE IF NOT EXISTS customers (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  contact_person  VARCHAR(255),
  email           VARCHAR(255),
  phone           VARCHAR(50),
  address         TEXT,
  status          VARCHAR(50) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
