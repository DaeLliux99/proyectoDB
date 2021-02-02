CREATE TABLE clientes (
  id int NOT NULL AUTO_INCREMENT,
  DNI varchar(15) NOT NULL,
  nombres varchar(60) NOT NULL,
  apellidos varchar(60) NOT NULL,
  telefono varchar(20) NOT NULL,
  direccion varchar(70) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE obras (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(40) NOT NULL,
  direccion varchar(70) NOT NULL,
  tipo varchar(20) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE contratos (
  id int NOT NULL AUTO_INCREMENT,
  tipo varchar(20) NOT NULL,
  cliente_id int NOT NULL,
  obra_id int DEFAULT NULL,
  PRIMARY KEY (id,cliente_id),
  KEY fk_planE (obra_id),
  KEY fk_obra (cliente_id),
  CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_obra FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE planesejecucion (
  id int NOT NULL AUTO_INCREMENT,
  fechaInicio date NOT NULL,
  fechaFin date NOT NULL,
  descripcion text,
  obra_id int NOT NULL,
  PRIMARY KEY (id,obra_id),
  KEY fk_planE (obra_id),
  CONSTRAINT fk_planE FOREIGN KEY (obra_id) REFERENCES obras (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE personal (
  id int NOT NULL AUTO_INCREMENT,
  DNI varchar(40) NOT NULL,
  nombres varchar(60) NOT NULL,
  apellidos varchar(60) NOT NULL,
  telefono varchar(20) NOT NULL,
  direccion varchar(70) NOT NULL,
  tipo varchar(30) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE supervisores (
  personal_id int NOT NULL,
  contraseña varchar(100) NOT NULL,
  PRIMARY KEY (personal_id),
  CONSTRAINT fk_supervisor FOREIGN KEY (personal_id) REFERENCES personal (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE obreros (
  personal_id int NOT NULL,
  especialidad varchar(20) NOT NULL,
  PRIMARY KEY (personal_id),
  CONSTRAINT fk_obrero FOREIGN KEY (personal_id) REFERENCES personal (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE actividades (
  id int NOT NULL AUTO_INCREMENT,
  id_obra int NOT NULL,
  id_planE int NOT NULL,
  estado varchar(20) NOT NULL,
  observaciones text,
  fechaInicio date NOT NULL,
  fechaFin date NOT NULL,
  descripcion text,
  id_supervisor int DEFAULT NULL,
  PRIMARY KEY (id,id_planE,id_obra),
  KEY fk_planE2 (id_planE),
  KEY fk_obra2 (id_obra),
  KEY fk_supervisorX (id_supervisor),
  CONSTRAINT fk_obra2 FOREIGN KEY (id_obra) REFERENCES planesejecucion (obra_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_planE2 FOREIGN KEY (id_planE) REFERENCES planesejecucion (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_supervisorX FOREIGN KEY (id_supervisor) REFERENCES supervisores (personal_id)
);

CREATE TABLE desempeñoobrero (
  id_obrero int NOT NULL,
  id_actividad int NOT NULL,
  id_planEX int NOT NULL,
  id_obraX int NOT NULL,
  descripcion text,
  desempeño varchar(20) DEFAULT NULL,
  puesto varchar(20) DEFAULT NULL,
  PRIMARY KEY (id_obrero,id_actividad,id_planEX,id_obraX),
  KEY fk_actividad (id_actividad),
  KEY fk_obra3 (id_obraX),
  KEY fk_planE3 (id_planEX),
  CONSTRAINT fk_actividad FOREIGN KEY (id_actividad) REFERENCES actividades (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_obra3 FOREIGN KEY (id_obraX) REFERENCES actividades (id_obra) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_obrero3 FOREIGN KEY (id_obrero) REFERENCES obreros (personal_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_planE3 FOREIGN KEY (id_planEX) REFERENCES actividades (id_planE) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE capacidades (
	id int NOT NULL auto_increment,
    capacidad varchar(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE obrero_tiene_capacidades (
	id_obrero int NOT NULL,
    id_capacidad int NOT NULL,
    PRIMARY KEY (id_obrero, id_capacidad),
    KEY fk_obrero4 (id_obrero),
    KEY fk_capacidad (id_capacidad),
    CONSTRAINT fk_obrero4 FOREIGN KEY (id_obrero) references obreros (personal_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_capacidad FOREIGN KEY (id_capacidad) references capacidades (id) ON DELETE CASCADE ON UPDATE CASCADE
);
