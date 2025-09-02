PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name    TEXT    NOT NULL,
  last_name     TEXT    NOT NULL,
  phone_number  TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS addresses (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id     INTEGER NOT NULL,
  address_details TEXT    NOT NULL,
  city            TEXT    NOT NULL,
  state           TEXT    NOT NULL,
  pin_code        TEXT    NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);
