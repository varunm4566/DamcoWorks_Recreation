-- CSAT survey responses linked to customers
CREATE TABLE IF NOT EXISTS csat_surveys (
  id              SERIAL PRIMARY KEY,
  customer_id     INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  score           DECIMAL(3,2) NOT NULL,
  poc             VARCHAR(255) NOT NULL,
  response_date   DATE NOT NULL,
  testimonial     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_csat_surveys_customer_id ON csat_surveys(customer_id);
