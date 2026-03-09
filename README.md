# ConsHer Frontend

Interfaz web del sistema **ConsHer**, diseñada para facilitar la gestión de operaciones internas dentro de una empresa constructora.

El frontend consume los servicios del backend mediante una **API REST** para mostrar información y permitir la interacción del usuario con el sistema.

---

# Descripción

La aplicación permite gestionar distintos aspectos operativos de la empresa mediante una interfaz web intuitiva.

Entre las funcionalidades principales se encuentran:

- consulta de productos
- gestión de pedidos
- control de gastos
- administración de proveedores
- generación de cotizaciones y cálculo de materiales

El objetivo es **centralizar la operación interna del negocio y mejorar la eficiencia administrativa**.

---

# Tecnologías Utilizadas

## Frontend

- React
- JavaScript
- HTML
- CSS
- Bootstrap / Tailwind (dependiendo del módulo)

## Integración

- API REST
- Fetch / Axios para consumo de endpoints

---

# Arquitectura del Sistema

El frontend funciona como cliente web que consume la API del backend.

```
Usuario
│
▼
Interfaz Web (React)
│
▼
API Backend
│
▼
Base de datos
```

---

# Funcionalidades

## Dashboard Principal

Vista general del sistema con acceso a los módulos principales.

**El dashboard solo se muestra al usuario administrador.**

<img width="1919" height="1073" src="https://github.com/user-attachments/assets/3190709c-d5c9-49ef-af72-a7070fc97d99">

---

## Catálogo de Propiedades (Público)

Permite visualizar las propiedades disponibles dentro del catálogo.

**Catálogo con movimiento interactivo estilo Netflix**

<img width="1919" height="1067" src="https://github.com/user-attachments/assets/dabbfc64-de42-4b5e-bb05-55c32cb20b70">

---

## Vista de Cada Propiedad

Permite visualizar fotos principales de las propiedades junto con información relevante como:

- ubicación
- precio
- dimensiones
- características

**Tarjeta principal de cada casa**

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/db934409-7fa0-4daf-90b0-404ec1f0a41d">

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/c2956d92-e019-4a17-a516-a2fd8b088080">

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/1572598b-0f4c-4650-9386-3652d97ef070">

---

## Gestión de Propiedades

Interfaz para crear y administrar propiedades dentro del sistema de administrador.

**Se muestran pequeñas tarjetas de cada proyecto**

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/658918c9-67a3-423b-8956-69ee2534b57d">

---

Al agregar o editar propiedades se puede incluir información como:

- fotografías
- ubicación en el mapa
- datos generales de la propiedad

<img width="1918" height="1027" src="https://github.com/user-attachments/assets/ea582ff6-9bd0-4bee-950f-c48265e741a3">

---

## Control de Gastos

Registro y visualización de gastos operativos.

**Los gastos se dividen por proyectos**

<img width="1919" height="873" src="https://github.com/user-attachments/assets/9939b5ce-b6d6-4423-80aa-4c409300120d">

---

### Vista Interna del Proyecto

Dentro de cada proyecto se pueden registrar y visualizar gastos específicos.

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/7b53002f-7612-4e38-9159-cdb94c8b76cf">

---

## Calculadora de Cotizaciones

Herramienta para generar cotizaciones de materiales y exportarlas en **PDF**.

La calculadora permite:

- dividir materiales por categorías
- calcular precios por metro cuadrado
- integrar precios de proveedores

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/a363e258-0c0c-4895-b4b6-83dd9322a78b">

---

# Diseño Responsivo

La aplicación es **totalmente responsiva** y cuenta con un diseño minimalista optimizado para diferentes dispositivos.

## Vista en dispositivos móviles

<img width="946" height="915" src="https://github.com/user-attachments/assets/617e68ce-d4b0-42cf-8149-2d8ce69fe0fb">

<img width="940" height="923" src="https://github.com/user-attachments/assets/3e6005c8-acc5-41c3-bc05-42ade7066c84">

<img width="940" height="916" src="https://github.com/user-attachments/assets/ae08b8a7-7589-4562-af4d-20bd8fbdfda2">

<img width="956" height="916" src="https://github.com/user-attachments/assets/1f29adfb-468b-4928-b5f9-7276fd305f6f">

<img width="936" height="929" src="https://github.com/user-attachments/assets/f57674a4-38ca-411f-af46-746d163ab140">

---

# Tema Visual

El sistema incluye **modo de cambio de color** para mejorar la experiencia visual del usuario.

<img width="1919" height="1079" src="https://github.com/user-attachments/assets/27dbe9d0-7c34-4f8d-8d4e-79f1d6b9ebf0">

<img width="1919" height="1078" src="https://github.com/user-attachments/assets/be048680-c59e-4ab9-891a-72696697abd1">

---

# Instalación

Clonar repositorio
git clone https://github.com/daanielsss/ConsHerFrontend


Entrar al proyecto


cd ConsHerFrontend


Instalar dependencias


npm install


Ejecutar proyecto


npm start


---

# Conexión con Backend

El frontend consume la API disponible en:


http://localhost:3000/api


La URL puede modificarse en el archivo de configuración del proyecto.

---

# Autor

**Carlos Daniel Hernández Aguilar**

Software Developer

GitHub  
https://github.com/daanielsss
