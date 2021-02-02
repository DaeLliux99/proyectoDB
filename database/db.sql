CREATE DATABASE database_CSAC;

USE database_CSAC;

--CREACION TABLA CLIENTES
CREATE TABLE clientes(
    id INT(11) NOT NULL,
    DNI VARCHAR (15) NOT NULL,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(70) NOT NULL
);

ALTER TABLE clientes
    ADD PRIMARY KEY (id);

ALTER TABLE clientes
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--CREACION TABLA OBRAS
CREATE TABLE obras(
    id INT(11) NOT NULL,
    nombre VARCHAR(40) NOT NULL,
    direccion VARCHAR(70) NOT NULL,
    tipo VARCHAR(20) NOT NULL
);

ALTER TABLE obras
    ADD PRIMARY KEY (id);

ALTER TABLE obras
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--CREACION TABLA CONTRATOS

CREATE TABLE contratos(
    id INT(11) NOT NULL,
    estado VARCHAR(40) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    cliente_id INT(11) NOT NULL,
    obra_id INT(11) NOT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_obra FOREIGN KEY (obra_id) REFERENCES obras(id)
);

ALTER TABLE contratos
    ADD PRIMARY KEY (id, cliente_id);

ALTER TABLE contratos
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;


--CREACION TABLAS PERSONAL

CREATE TABLE personal(
    id INT(11) NOT NULL,
    DNI VARCHAR(40) NOT NULL,
    password VARCHAR (60) NOT NULL,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(70) NOT NULL
);

ALTER TABLE personal
    ADD PRIMARY KEY (id);

ALTER TABLE personal
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--CREACION TABLA OBREROS

CREATE TABLE obreros(
    personal_id INT (11) NOT NULL,
    especialidad VARCHAR(20) NOT NULL,
    CONSTRAINT fk_obrero FOREIGN KEY (personal_id) REFERENCES personal (id)
);

ALTER TABLE obreros
    ADD PRIMARY KEY (personal_id);

--CREACION TABLA SUPERVISORES

CREATE TABLE supervisores(
    personal_id INT (11) NOT NULL,
    CONSTRAINT fk_supervisor FOREIGN KEY (personal_id) REFERENCES personal (id)
);

ALTER TABLE supervisores
    ADD PRIMARY KEY (personal_id);

--CREACION TABLA PLANES DE EJECUCION

CREATE TABLE planesEjecucion(
    id INT(11) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL,
    descripcion TEXT,
    obra_id INT (11) NOT NULL,
    CONSTRAINT fk_planE FOREIGN KEY (obra_id) REFERENCES obras (id)
);

ALTER TABLE planesEjecucion
    ADD PRIMARY KEY (id, obra_id);

ALTER TABLE planesEjecucion
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--CREACION TABLA ACTIVIDADES

CREATE TABLE actividades(
    id INT (11) NOT NULL,
    id_obra INT (11) NOT NULL,
    id_planE INT (11) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    observaciones TEXT,
    obra_id INT (11) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    descripcion TEXT,
    CONSTRAINT fk_planE2 FOREIGN KEY (id_planE) REFERENCES planesEjecucion (id),
    CONSTRAINT fk_obra2 FOREIGN KEY (id_obra) REFERENCES planesEjecucion (obra_id)
);

ALTER TABLE actividades
    ADD PRIMARY KEY (id, id_planE, id_obra);

ALTER TABLE actividades
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--CREACION TABLA DESEMPEÑO OBRERO

CREATE TABLE desempeñoObrero(
    id_obrero INT (11) NOT NULL,
    id_actividad INT (11) NOT NULL,
    id_planEX INT (11) NOT NULL,
    id_obraX INT (11) NOT NULL,
    descripcion TEXT,
    desempeño VARCHAR (20) NOT NULL,
    puesto VARCHAR (20) NOT NULL,
    CONSTRAINT fk_obrero3 FOREIGN KEY (id_obrero) REFERENCES obreros (personal_id),
    CONSTRAINT fk_actividad FOREIGN KEY (id_actividad) REFERENCES actividades (id),
    CONSTRAINT fk_planE3 FOREIGN KEY (id_planEX) REFERENCES actividades (id_planE),
    CONSTRAINT fk_obra3 FOREIGN KEY (id_obraX) REFERENCES actividades (id_obra)
);

ALTER TABLE desempeñoObrero
    ADD PRIMARY KEY (id_obrero, id_actividad, id_planEX, id_obraX);