# **TickHawk - System Entity Specification**

## **Architecture Overview**

TickHawk is a comprehensive ticket management system built on a multi-tenant architecture. The system allows different companies to manage their customer support and internal issues through a role-based access system.

---

## **Key Entities**

## **1. Company**
**Description:** Represents an organization that contracts the service and has associated customer users.

### **Attributes:**
- `id`: Unique identifier
- `name`: Company name
- `monthlyHours`: Monthly allocated hours (null if unlimited)
- `hourPool`: Available hours in the pool (null if unlimited or monthly)
- `unlimitedHours`: Boolean indicating unlimited hours
- `renewalDate`: Date when monthly hours are renewed (if applicable)
- `contracts`: Relationship with contracts/subscriptions

### **Relationships:**
- **1:N** with `User` (customer role)
- **1:N** with `Department`

---

## **2. User**
**Description:** System user with role-based access (admin, agent, or customer)

### **Attributes:**
- `id`: Unique identifier
- `username`: Username for login
- `email`: Email address
- `password`: Encrypted password
- `role`: User role (admin, agent, customer)
- `name`: Full name
- `profileImage`: Profile picture
- `companyId`: Reference to associated company (for customers and agents)
- `departmentId`: Reference to associated department (for agents)

### **Relationships:**
- **N:1** with `Company` (if customer or agent)
- **N:1** with `Department` (if agent)
- **1:N** with `Ticket` (as creator)
- **1:N** with `Ticket` (as assigned agent)
- **1:N** with `Comment`

---

## **3. Department**
**Description:** Organizational unit within a company for ticket categorization

### **Attributes:**
- `id`: Unique identifier
- `name`: Department name
- `companyId`: Reference to parent company
- `description`: Department description

### **Relationships:**
- **N:1** with `Company`
- **1:N** with `User` (agents)
- **1:N** with `Ticket`

---

## **4. Ticket**
**Description:** Represents an issue or task opened by a user

### **Attributes:**
- `id`: Unique identifier
- `status`: Current ticket status (`pending`, `open`, `in_progress`, `resolved`, `closed`)
- `priority`: Ticket priority (`low`, `medium`, `high`, `critical`)
- `subject`: Title or summary
- `content`: Detailed description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `closedAt`: Closure timestamp
- `customerId`: Reference to customer who opened the ticket
- `assignedAgentId`: Reference to assigned agent
- `departmentId`: Reference to associated department
- `companyId`: Reference to associated company
- `tags`: Array of tags/keywords

### **Relationships:**
- **N:1** with `User` (as customer)
- **N:1** with `User` (as assigned agent)
- **N:1** with `Department`
- **N:1** with `Company`
- **1:N** with `Comment`
- **1:N** with `Event` (history)
- **1:N** with `FileTicket` (attachments)

---

## **5. Comment**
**Description:** Response or message within a ticket thread

### **Attributes:**
- `id`: Unique identifier
- `content`: Comment text
- `createdAt`: Creation timestamp
- `userId`: Reference to the user who made the comment
- `ticketId`: Reference to the associated ticket
- `timeSpent`: Time spent by agent (in minutes)
- `isInternal`: Boolean indicating if comment is for internal use only

### **Relationships:**
- **N:1** with `Ticket`
- **N:1** with `User`
- **1:N** with `FileTicket` (attachments)

---

## **6. File**
**Description:** File uploaded to the system

### **Attributes:**
- `id`: Unique identifier
- `originalName`: Original file name
- `mimeType`: File MIME type
- `size`: File size in bytes
- `path`: Storage path
- `file`: File identifier in storage
- `createdAt`: Upload timestamp

### **Relationships:**
- **1:N** with `FileTicket` (as file attachment to tickets)

---

## **7. Event**
**Description:** Record of changes or actions performed on a ticket

### **Attributes:**
- `id`: Unique identifier
- `type`: Event type (status_change, assignment, etc.)
- `description`: Description of the change or action
- `timestamp`: Event timestamp
- `userId`: Reference to the user who performed the action
- `ticketId`: Reference to the associated ticket
- `metadata`: Additional event data

### **Relationships:**
- **N:1** with `Ticket`
- **N:1** with `User`

---

## **8. Contract**
**Description:** Subscription or service contract for a company

### **Attributes:**
- `id`: Unique identifier
- `startDate`: Contract start date
- `endDate`: Contract end date (if applicable)
- `type`: Contract type (monthly, hour_pool, unlimited)
- `hours`: Allocated hours (if applicable)
- `notes`: Additional contract information
- `companyId`: Reference to associated company

### **Relationships:**
- **N:1** with `Company`

---

## **File Storage Providers**

TickHawk supports multiple file storage providers:

1. **Local Storage**: Files stored on the local filesystem
2. **AWS S3**: Files stored in Amazon S3 buckets
3. **MinIO**: Files stored in MinIO object storage
4. **OVH Object Storage**: Files stored in OVH's S3-compatible storage

---

## **Key Features Implemented**

1. **Multi-Tenant Architecture**
   - Companies, departments, and role-based access control

2. **Ticket Management**
   - Full ticket lifecycle
   - Comments and replies
   - File attachments
   - Event history

3. **User Management**
   - Role-based access (admin, agent, customer)
   - Profile management
   - Company and department association

4. **Reporting**
   - Ticket statistics by date range
   - Customer and agent views

5. **File Management**
   - Multiple storage provider options
   - Upload and download functionality
