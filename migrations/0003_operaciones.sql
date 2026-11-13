-- Identificador de operación que genera el panel al abrir «Nuevo producto» y en cada subida
-- de foto. Si la misma operación llega dos veces (reintento, doble pulsación, red inestable),
-- el servidor devuelve el resultado de la primera en lugar de crear otro producto u otra foto.
ALTER TABLE productos ADD COLUMN operacion TEXT;
CREATE UNIQUE INDEX idx_productos_operacion ON productos (operacion) WHERE operacion IS NOT NULL;

ALTER TABLE subidas ADD COLUMN operacion TEXT;
CREATE UNIQUE INDEX idx_subidas_operacion ON subidas (operacion) WHERE operacion IS NOT NULL;
