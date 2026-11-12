-- Catálogo de Tienda Lysa.
-- precio_centimos NULL = la web muestra «Consultar precio».
-- marca guarda el nombre tal como se muestra; marca_slug sirve para filtrar.
CREATE TABLE productos (
  id              TEXT PRIMARY KEY,
  referencia      TEXT NOT NULL UNIQUE,
  titulo          TEXT NOT NULL CHECK (length(titulo) BETWEEN 2 AND 120),
  slug            TEXT NOT NULL UNIQUE,
  descripcion     TEXT NOT NULL DEFAULT '' CHECK (length(descripcion) <= 1000),
  precio_centimos INTEGER CHECK (precio_centimos IS NULL OR precio_centimos BETWEEN 0 AND 9999999),
  categoria       TEXT NOT NULL CHECK (categoria IN ('bolsos', 'mochilas', 'maletas', 'complementos', 'zapatillas')),
  marca           TEXT CHECK (marca IS NULL OR length(marca) BETWEEN 1 AND 60),
  marca_slug      TEXT,
  color           TEXT CHECK (color IS NULL OR length(color) <= 60),
  visible         INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
  destacado       INTEGER NOT NULL DEFAULT 0 CHECK (destacado IN (0, 1)),
  creado_en       TEXT NOT NULL,
  actualizado_en  TEXT NOT NULL
);

CREATE INDEX idx_productos_publico ON productos (visible, categoria, marca_slug);
CREATE INDEX idx_productos_orden ON productos (destacado DESC, creado_en DESC);

-- Imágenes en R2. orden 0 = imagen principal.
CREATE TABLE imagenes (
  id          TEXT PRIMARY KEY,
  producto_id TEXT NOT NULL REFERENCES productos (id) ON DELETE CASCADE,
  clave       TEXT NOT NULL UNIQUE,
  alt         TEXT NOT NULL DEFAULT '',
  orden       INTEGER NOT NULL DEFAULT 0,
  bytes       INTEGER NOT NULL DEFAULT 0,
  creado_en   TEXT NOT NULL
);

CREATE INDEX idx_imagenes_producto ON imagenes (producto_id, orden);

-- Contador de referencias LYSA-NNN: solo sube, nunca se reutiliza una referencia.
CREATE TABLE contadores (
  nombre TEXT PRIMARY KEY,
  valor  INTEGER NOT NULL
);

INSERT INTO contadores (nombre, valor) VALUES ('referencia', 0);
