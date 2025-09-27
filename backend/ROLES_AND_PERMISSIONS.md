> Last Updated: 2024-05-26

# Role-Based Access Control (RBAC) Architecture

This document outlines the target architecture for the role-based access control system within the project. Its purpose is to define user roles, their permissions, and the technical implementation strategy to ensure data security, integrity, and confidentiality.

---

## 1. Core Principles

-   **Principle of Least Privilege**: Users should only have access to the information and resources that are strictly necessary for their job function.
-   **Hierarchy Awareness**: The system must recognize and enforce manager-subordinate relationships.
-   **Centralized Logic**: Permission logic should be centralized in the `core` application to ensure consistency and maintainability across all modules (`insurances`, `mortgage`, etc.).

---

## 2. Role Definitions

Our system defines three primary roles, controlled by the `role` field on the custom `User` model.

### 2.1. `ADVISER` (Консультант)
This is the standard user of the system. An Adviser's access is strictly limited to their own data.

-   **Can**: Create new deals (Policies, Mortgage Cases) and associated clients. The system automatically assigns them as the owner.
-   **Can**: View and edit all data for which they are the designated adviser.
-   **Can**: View shared resources like Products and Lenders (read-only).
-   **Cannot**: View or edit data belonging to other advisers (unless they are also a Manager).

### 2.2. `MANAGER` (Менеджер)
A Manager is an Adviser who also has a team of subordinates. This is defined by their `agency_number` (their team ID) and the `parent_agency_id` of their subordinates.

-   **Has**: All permissions of an **Adviser** for their own personal deals.
-   **Can**: View and edit all data (Policies, Cases, Commissions, etc.) belonging to users in their team (subordinates).
-   **Can**: View aggregated performance reports for their team.

### 2.3. `ADMIN` (Администратор / Staff)
A user with `is_staff=True`. This role is for system administrators and back-office personnel.

-   **Has**: Unrestricted "god-mode" access to all data across the entire system.
-   **Can**: Manage users, products, and other system-wide settings.
-   **Can**: Run data ingestion tasks.
-   **Can**: View all financial and performance reports for the entire company.

---

## 3. Permission Matrix

| Resource                  | Action                 | Adviser        | Manager                             | Admin          |
| ------------------------- | ---------------------- | -------------- | ----------------------------------- | -------------- |
| **Policies / Cases**      | Create                 | ✅ (Own)       | ✅ (Own)                            | ✅ (Any)       |
|                           | Read                   | ✅ (Own)       | ✅ (Own + Subordinates)             | ✅ (All)       |
|                           | Update / Delete        | ✅ (Own)       | ✅ (Own + Subordinates)             | ✅ (All)       |
| **Commissions / Fees**    | Read                   | ✅ (Own)       | ✅ (Own + Subordinates)             | ✅ (All)       |
|                           | Update / Delete        | ✅ (Own)       | ✅ (Own + Subordinates)             | ✅ (All)       |
| **Clients**               | Create                 | ✅             | ✅                                  | ✅             |
|                           | Read                   | ✅ (Own)       | ✅ (Own + Subordinates)             | ✅ (All)       |
| **Products / Lenders**    | Read                   | ✅ (All)       | ✅ (All)                            | ✅ (All)       |
|                           | Create / Update / Delete | ❌             | ❌                                  | ✅ (All)       |
| **Reporting**             | Read (Personal)        | ✅             | ✅ (Team)                           | ✅ (All)       |
| **Data Ingestion**        | Create / Read          | ❌             | ❌                                  | ✅ (All)       |

---

## 4. Technical Implementation

-   **User Model**: A custom `User` model (`apps.users.models.User`) with a `role` enum (`ADVISER`, `MANAGER`) and fields for hierarchy (`agency_number`, `parent_agency_id`).
-   **Centralized Permissions**: All permission logic is located in `apps.core.permissions`.
    -   `IsAdminOrReadOnly`: For read-only resources like Products.
    -   `IsOwnerOrReadOnly`: For objects with a direct link to the adviser.
    -   `IsRelatedOwnerOrReadOnly`: For objects with an indirect link (e.g., Commission -> Policy -> Adviser).
-   **Centralized Mixins**: Common `ViewSet` logic is located in `apps.core.mixins`.
    -   `HierarchicalQuerySetMixin`: Provides the `get_allowed_advisers` method to determine which users' data can be seen.
    -   This mixin is the core of enforcing the "Read (Own + Subordinates)" rule for Managers.

