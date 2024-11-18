# **Especificación de Entidades para el Sistema de Tickets/Issues**

## **1. Empresa**
**Descripción:** Representa a la organización que contrata el servicio y tiene asociados usuarios cliente (cliente user).

### **Atributos:**
- `id`: Identificador único.
- `nombre`: Nombre de la empresa.
- `horas_mensuales`: Cantidad de horas asignadas mensualmente (nullable si tiene horas infinitas).
- `bolsa_horas`: Cantidad de horas disponibles en la bolsa (nullable si tiene horas infinitas o mensuales).
- `horas_infinitas`: Booleano que indica si tiene horas ilimitadas.
- `facturas`: Relación con las facturas asociadas.
- `fecha_renovación_horas`: Fecha en la que se renuevan las horas mensuales (si aplica).

### **Relaciones:**
- **1:N** con `ClienteUser`.
- **1:N** con `Factura`.

---

## **2. ClienteUser**
**Descripción:** Usuario perteneciente a una empresa que puede abrir y participar en tickets.

### **Atributos:**
- `id`: Identificador único.
- `nombre`: Nombre del usuario.
- `email`: Correo electrónico del usuario.
- `empresa_id`: Referencia a la empresa a la que pertenece.

### **Relaciones:**
- **N:1** con `Empresa`.
- **1:N** con `Ticket`.

---

## **3. UserAdmin**
**Descripción:** Usuario administrador que gestiona el sistema.

### **Atributos:**
- `id`: Identificador único.
- `nombre`: Nombre del administrador.
- `email`: Correo electrónico.

---

## **4. UserTecnico**
**Descripción:** Usuario técnico que resuelve tickets.

### **Atributos:**
- `id`: Identificador único.
- `nombre`: Nombre del técnico.
- `email`: Correo electrónico.

### **Relaciones:**
- **1:N** con `Ticket` (asignado como técnico).

---

## **5. Ticket**
**Descripción:** Representa un problema o tarea abierta por un ClienteUser.

### **Atributos:**
- `id`: Identificador único.
- `estado`: Estado actual del ticket (`pendiente`, `abierto`, `en proceso`, `cerrado`).
- `subject`: Título o resumen del problema.
- `contenido`: Descripción detallada del problema.
- `horas_usadas`: Array que almacena los registros de horas trabajadas en el ticket.
- `fecha_creacion`: Fecha en la que se creó el ticket.
- `fecha_inicio`: Fecha en la que se comenzó a trabajar en el ticket.
- `fecha_cierre`: Fecha en la que se cerró el ticket.
- `usuario_client_id`: Referencia al usuario cliente que abrió el ticket.
- `usuario_tecnico_id`: Referencia al técnico asignado.
- `usuarios_espectadores`: Lista de usuarios (técnicos o clientes) que pueden observar el ticket.
- `historial`: Lista de eventos asociados al ticket (e.g., cambio de estado, asignación de técnico).
- `status`: Estado general del ticket (e.g., cerrado, en proceso).
- `adjuntos`: Archivos asociados al ticket.
- `subtareas`: Lista de subtareas (modo TODO list).
- `comentarios`: Lista de comentarios asociados al ticket.

### **Relaciones:**
- **N:1** con `ClienteUser` (quien abre el ticket).
- **N:1** con `UserTecnico` (técnico asignado).
- **N:N** con `ClienteUser` y `UserTecnico` (como espectadores).
- **1:N** con `Comentario`.

---

## **6. Comentario**
**Descripción:** Respuesta o mensaje dentro de un ticket.

### **Atributos:**
- `id`: Identificador único.
- `fecha`: Fecha en la que se hizo el comentario.
- `contenido`: Texto del comentario.
- `adjuntos`: Archivos adjuntos al comentario.
- `usuario_id`: Referencia al usuario que realizó el comentario.

### **Relaciones:**
- **N:1** con `Ticket`.

---

## **7. Factura**
**Descripción:** Documento asociado a la compra de una bolsa de horas o al uso del sistema.

### **Atributos:**
- `id`: Identificador único.
- `fecha_emision`: Fecha de emisión de la factura.
- `monto`: Monto total de la factura.
- `archivo_pdf`: Archivo PDF de la factura.
- `empresa_id`: Referencia a la empresa asociada.

### **Relaciones:**
- **N:1** con `Empresa`.

---

## **8. HistorialEvento**
**Descripción:** Registro de cambios o acciones realizadas sobre un ticket.

### **Atributos:**
- `id`: Identificador único.
- `fecha`: Fecha del evento.
- `descripcion`: Descripción del cambio o acción.
- `usuario_id`: Referencia al usuario que realizó la acción.

### **Relaciones:**
- **N:1** con `Ticket`.

---

## **Relaciones Clave**
1. **Empresa**:
   - Tiene múltiples `ClienteUser`.
   - Puede tener múltiples `Factura`.

2. **ClienteUser**:
   - Puede abrir múltiples `Ticket`.
   - Puede ser espectador de múltiples `Ticket`.

3. **UserTecnico**:
   - Puede resolver múltiples `Ticket`.
   - Puede ser espectador de múltiples `Ticket`.

4. **Ticket**:
   - Relación con `ClienteUser` (creador).
   - Relación con `UserTecnico` (resolutor).
   - Relación con múltiples `ClienteUser` y `UserTecnico` (espectadores).
   - Relación con múltiples `Comentario`.
   - Relación con múltiples `HistorialEvento`.
