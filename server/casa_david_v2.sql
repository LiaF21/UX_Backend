CREATE TYPE GENERO as ENUM('MASCULINO', 'FEMENINO', 'OTRO');
CREATE TYPE ROL as ENUM('ADMIN', 'USUARIO', 'OTRO');
CREATE TYPE TIPO AS ENUM('INDIVIDUAL', 'MATRIMONIAL', 'CAMAROTE');
CREATE TABLE "persona" (
  "id_persona" SERIAL PRIMARY KEY,
  "id_ocupacion" INT,
  "id_procedencia" INT NOT NULL,
  "dni" VARCHAR(20) UNIQUE NOT NULL,
  "primer_nombre" VARCHAR(30) NOT NULL,
  "segundo_nombre" VARCHAR(30),
  "primer_apellido" VARCHAR(30) NOT NULL,
  "segundo_apellido" VARCHAR(30),
  "direccion" TEXT,
  "telefono" VARCHAR(15),
  "genero" GENERO NOT NULL,
  "fecha_nacimiento" DATE NOT NULL
);

CREATE TABLE "ocupacion" (
  "id_ocupacion" SERIAL PRIMARY KEY,
  "descripcion" TEXT NOT NULL
);

CREATE TABLE "hospital" (
  "id_hospital" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "direccion" TEXT NOT NULL
);

CREATE TABLE "piso" (
  "id_piso" SERIAL PRIMARY KEY,
  "id_hospital" INT NOT NULL,
  "nombre_piso" VARCHAR(10) NOT NULL
);

CREATE TABLE "sala" (
  "id_sala" SERIAL PRIMARY KEY,
  "id_piso" INT NOT NULL,
  "nombre_sala" VARCHAR(10) NOT NULL
);

CREATE TABLE "usuario" (
  "id_usuario" SERIAL PRIMARY KEY,
  "id_persona" INT NOT NULL,
  "id_hospital" INT,
  "nickname" VARCHAR(25) UNIQUE NOT NULL,
  "contrasena" VARCHAR(100) NOT NULL,
  "rol" ROL NOT NULL
);

CREATE TABLE "usuario_privilegio" (
  "id_usuario_privilegio" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "id_privilegio" INT NOT NULL
);

CREATE TABLE "privilegio" (
  "id_privilegio" int PRIMARY KEY,
  "descripcion" varchar(355)
);

CREATE TABLE "lista_negra" (
  "id_lista_negra" SERIAL PRIMARY KEY,
  "id_persona" INT NOT NULL,
  "id_regla" INT NOT NULL,
  "observacion" TEXT
);

CREATE TABLE "reglamento" (
  "id_regla" SERIAL PRIMARY KEY,
  "numero_regla" INT NOT NULL,
  "descripcion_regla" TEXT NOT NULL
);

CREATE TABLE "lista_espera" (
  "id_lista_espera" SERIAL PRIMARY KEY,
  "id_persona" INT NOT NULL,
  "observacion" TEXT,
  "fecha_entrada" TIMESTAMP NOT NULL
);

CREATE TABLE "huesped" (
  "id_huesped" SERIAL PRIMARY KEY,
  "id_persona" INT NOT NULL,
  "parentesco_paciente" VARCHAR(50),
  "reingreso" BOOLEAN NOT NULL
);

CREATE TABLE "paciente" (
  "id_paciente" SERIAL PRIMARY KEY,
  "id_person" INT NOT NULL,
  "id_hospital" INT,
  "id_piso" INT,
  "id_sala" INT,
  "causa_visita" VARCHAR(100),
  "observacion" TEXT
);

CREATE TABLE "paciente_huesped" (
  "id_paciente_huesped" SERIAL PRIMARY KEY,
  "id_paciente" INT NOT NULL,
  "id_huesped" INT NOT NULL
);

CREATE TABLE "afiliado_huesped" (
  "id_afiliado_huesped" SERIAL PRIMARY KEY,
  "id_afiliado" INT NOT NULL,
  "id_huesped" INT NOT NULL
);

CREATE TABLE "procedencia" (
  "id_procedencia" SERIAL PRIMARY KEY,
  "departamento" varchar(50) NOT NULL,
  "municipio" varchar(50) NOT NULL
);

CREATE TABLE "habitacion" (
  "id_habitacion" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(30) NOT NULL,
  "genero" GENERO NOT NULL,
  "disponible" BOOLEAN DEFAULT true
);

CREATE TABLE "cama" (
  "id_cama" SERIAL PRIMARY KEY,
  "id_habitacion" INT,
  "nomre" VARCHAR(30) NOT NULL,
  "tipo" TIPO NOT NULL,
  "disponible" BOOLEAN DEFAULT true
);

CREATE TABLE "reservacion" (
  "id_reservacion" SERIAL PRIMARY KEY,
  "id_huesped" INT NOT NULL,
  "id_cama" INT NOT NULL,
  "id_hospital" INT NOT NULL,
  "activa" BOOLEAN DEFAULT true,
  "becada" BOOLEAN DEFAULT false,
  "fecha_entrada" TIMESTAMP NOT NULL,
  "fecha_salida" TIMESTAMP
);

CREATE TABLE "transaccion" (
  "id_transaccion" SERIAL PRIMARY KEY,
  "id_huesped" INT,
  "valor" DECIMAL(6,2) NOT NULL,
  "fecha" TIMESTAMP NOT NULL,
  "becada" BOOLEAN DEFAULT false
);

CREATE TABLE "afiliado" (
  "id_afiliado" SERIAL PRIMARY KEY,
  "id_persona" INT,
  "condicion" VARCHAR(60)
);

CREATE TABLE "patrono" (
  "id_patrono" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL
);

CREATE TABLE "patrono_afiliado" (
  "id_patrono_afiliado" SERIAL PRIMARY KEY,
  "id_patrono" INT NOT NULL,
  "id_afiliado" INT NOT NULL
);

CREATE TABLE "iglesia" (
  "id_iglesia" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL
);

CREATE TABLE "iglesia_huesped" (
  "id_iglesia_huesped" SERIAL PRIMARY KEY,
  "id_iglesia" INT NOT NULL,
  "id_huesped" INT NOT NULL
);

ALTER TABLE "persona" ADD FOREIGN KEY ("id_ocupacion") REFERENCES "ocupacion" ("id_ocupacion");

ALTER TABLE "persona" ADD FOREIGN KEY ("id_procedencia") REFERENCES "procedencia" ("id_procedencia");

ALTER TABLE "piso" ADD FOREIGN KEY ("id_hospital") REFERENCES "hospital" ("id_hospital");

ALTER TABLE "sala" ADD FOREIGN KEY ("id_piso") REFERENCES "piso" ("id_piso");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id_hospital") REFERENCES "hospital" ("id_hospital");

ALTER TABLE "usuario_privilegio" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario");

ALTER TABLE "usuario_privilegio" ADD FOREIGN KEY ("id_privilegio") REFERENCES "privilegio" ("id_privilegio");

ALTER TABLE "lista_negra" ADD FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona");

ALTER TABLE "lista_negra" ADD FOREIGN KEY ("id_regla") REFERENCES "reglamento" ("id_regla");

ALTER TABLE "lista_espera" ADD FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona");

ALTER TABLE "huesped" ADD FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona");

ALTER TABLE "paciente" ADD FOREIGN KEY ("id_person") REFERENCES "persona" ("id_persona");

ALTER TABLE "paciente" ADD FOREIGN KEY ("id_hospital") REFERENCES "hospital" ("id_hospital");

ALTER TABLE "paciente" ADD FOREIGN KEY ("id_piso") REFERENCES "piso" ("id_piso");

ALTER TABLE "paciente" ADD FOREIGN KEY ("id_sala") REFERENCES "sala" ("id_sala");

ALTER TABLE "paciente_huesped" ADD FOREIGN KEY ("id_paciente") REFERENCES "paciente" ("id_paciente");

ALTER TABLE "paciente_huesped" ADD FOREIGN KEY ("id_huesped") REFERENCES "huesped" ("id_huesped");

ALTER TABLE "afiliado_huesped" ADD FOREIGN KEY ("id_afiliado") REFERENCES "afiliado" ("id_afiliado");

ALTER TABLE "afiliado_huesped" ADD FOREIGN KEY ("id_huesped") REFERENCES "huesped" ("id_huesped");

ALTER TABLE "cama" ADD FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion");

ALTER TABLE "reservacion" ADD FOREIGN KEY ("id_huesped") REFERENCES "huesped" ("id_huesped");

ALTER TABLE "reservacion" ADD FOREIGN KEY ("id_cama") REFERENCES "cama" ("id_cama");

ALTER TABLE "reservacion" ADD FOREIGN KEY ("id_hospital") REFERENCES "hospital" ("id_hospital");

ALTER TABLE "transaccion" ADD FOREIGN KEY ("id_huesped") REFERENCES "huesped" ("id_huesped");

ALTER TABLE "afiliado" ADD FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona");

ALTER TABLE "patrono_afiliado" ADD FOREIGN KEY ("id_patrono") REFERENCES "patrono" ("id_patrono");

ALTER TABLE "patrono_afiliado" ADD FOREIGN KEY ("id_afiliado") REFERENCES "afiliado" ("id_afiliado");

ALTER TABLE "iglesia_huesped" ADD FOREIGN KEY ("id_iglesia") REFERENCES "iglesia" ("id_iglesia");

ALTER TABLE "iglesia_huesped" ADD FOREIGN KEY ("id_huesped") REFERENCES "huesped" ("id_huesped");
