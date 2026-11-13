-- Fotos subidas desde el panel que todavía no pertenecen a ningún producto.
-- El panel sube primero las fotos (aquí y en R2) y después guarda el producto con su
-- conjunto final de fotos en una sola operación. Hasta ese momento, la tienda no cambia.
-- Las filas se conservan: una foto pasa a «imagenes» con el mismo id cuando se guarda.
CREATE TABLE subidas (
  id        TEXT PRIMARY KEY,
  clave     TEXT NOT NULL UNIQUE,
  bytes     INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT NOT NULL
);
