> Last Updated: 2024-05-26

# Mortgages Commission Module Architecture

This document outlines the target architecture for the mortgage commission module, designed to handle the complex requirements of the UK mortgage industry. It mirrors the professional standards and features implemented in the insurance module, including multi-level commission distribution, compliance, automation, and advanced analytics.

---

## Core Models

The data structure is designed for maximum detail and flexibility, reusing common entities like `Client` and `Adviser` from the core application.

### 1. `MortgageCase`
The central entity representing a single mortgage deal.

-   `case_number`: Unique identifier for the deal.
-   `client`, `adviser`, `lender`: ForeignKeys to the respective entities.
-   `property_address`, `property_type`: Details of the property.
-   `purchase_price`, `loan_amount`, `deposit_amount`: Core financial figures.
-   `interest_rate`, `mortgage_type`, `term_months`, `product_code`: Details of the mortgage product.
-   `status`: The current stage of the deal (e.g., 'In Progress', 'Offer Received', 'Completed', 'Cancelled').
-   `application_date`, `offer_date`, `completion_date`, `expiry_date`: Key milestone dates.
-   `client_source`, `mortgage_purpose`: Fields for marketing and analytics.
-   `fee_structure`, `case_document_links`: JSONFields for flexible data and document storage.
-   `mortgage_expiry_reminder_sent`, `mortgage_expiry_reminder_date`: Fields to control the automated 4-month expiry reminder for client retention.

### 2. `Lender`
Represents a mortgage provider (bank or financial institution).

-   `name`, `lender_id`, `contact_details`, `fca_reference_number`, `region`.

### 3. `Commission`
Represents the main procuration fee received from the lender for a `MortgageCase`.

-   `mortgage_case`: A One-to-One link to the mortgage deal.
-   `gross_commission`, `net_commission`: The core commission amounts.
-   `adviser_fee_percentage`, `adviser_fee_amount`: Calculation of the adviser's share.
-   `payment_status`, `date_received`, `date_paid_to_adviser`: Fields for tracking the payment lifecycle.

### 4. `BrokerFee`
A new model to handle the two-stage fee charged to the client.

-   `mortgage_case`: ForeignKey to the deal.
-   `stage`: The stage at which the fee is charged ('AIP' for Agreement in Principle, 'OFFER' for Mortgage Offer).
-   `amount`, `status`, `date_invoiced`, `date_paid`: Fields to track the fee payment.

### 5. `CommissionModifier` (Shared Abstract Model)
A flexible base for all financial adjustments, with concrete implementations for the mortgage context.

-   `MortgageRetention`: For holding back part of a commission.
-   `MortgageClawback`: For handling commission returns if a deal falls through.
-   `MortgageBonus`: For performance-based bonuses.
-   `MortgageOverride`: For manager/upline commission shares.
-   `MortgageReferralFee`: To track multiple referral fees from various sources (e.g., solicitors, surveyors) and procuration fees.

---

## Proposed API Architecture & Features

This section details the proposed features to build a professional-grade API for the mortgage module.

### 1. API Endpoints & Structure
-   **Core CRUD Endpoints**: Full API support for all new models (`/api/mortgages/cases/`, `/api/mortgages/lenders/`, etc.).
-   **Standard Features**: All list endpoints will support **pagination**, **filtering**, and **full-text search**.
-   **Performance**: We will implement list/detail serializers and optimize all database queries with `select_related` and `prefetch_related`.

### 2. Security & Permissions
-   **Authentication**: All endpoints will require Token-based authentication.
-   **Object-Level & Hierarchical Permissions**: An adviser will only see their own deals and clients. A manager will see their own data plus the data of their direct subordinates. This will apply to all relevant endpoints (`cases`, `commissions`, `clients`).

### 3. Business Process Automation
-   **Automated Expiry Reminders**: A scheduled task will run daily to identify mortgage cases expiring in 4 months and trigger notifications to the relevant advisers.
-   **Asynchronous Data Ingestion**: A dedicated, secure endpoint will be created for bulk-uploading commission statements from lenders, with background processing via Celery and a task-tracking system.
-   **Automated Clawbacks**: Cancelling a `MortgageCase` will automatically generate a corresponding `MortgageClawback` record.
-   **Data Integrity**: The API will enforce business rules, such as automatically assigning the correct adviser when a case is created.

### 4. Analytics & Dashboard
-   **Reporting Module**: A dedicated, admin-only reporting module with endpoints for:
    -   `adviser-performance`: KPIs for advisers, respecting the hierarchy.
    -   `lender-performance`: Financial breakdown by lender.
    -   `cancellation-analysis`: Analysis of cancelled deals.
-   **Personal Dashboard**: A single endpoint (`/api/mortgages/dashboard/`) providing an adviser with their real-time KPIs (e.g., commissions this month, deals nearing completion, upcoming expiry reminders).

### 5. Engineering Excellence
-   **Automated Testing**: We will build a comprehensive test suite covering security, business logic, and analytics to ensure reliability.
-   **API Documentation**: The API will be fully documented using `drf-spectacular` to generate an interactive Swagger UI.
-   **Admin Panel**: The Django Admin will be configured to provide a powerful back-office tool for managing mortgage data.
-   **Clean Code**: We will reuse existing components (like the `HierarchicalQuerySetMixin`) and follow the DRY principle to ensure the code is clean and maintainable.

---

This proposed architecture will deliver a robust, scalable, and secure system that fully covers the advanced requirements of a modern UK mortgage brokerage.

