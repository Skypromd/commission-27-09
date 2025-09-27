> Last Updated: 2024-05-29

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
-   `risk_score` (DecimalField): Internal risk assessment for the case.
-   `client_complaint_flag` (BooleanField): Flags if a complaint is associated with the case.
-   `client_complaint_details` (TextField): Details of any complaint.
-   `cross_sell_opportunity` (BooleanField): Flag for potential insurance cross-sell.
-   `integration_id` (CharField): For linking with external systems.

### 2. `Lender`
Represents a mortgage provider (bank or financial institution).

-   `name`, `lender_id`, `contact_details`, `fca_reference_number`, `region`.

### 3. `Client` (Shared Core Model)
Represents a mortgage applicant.

-   `name`, `client_id`, `dob`, `address`, `contact_details`.
-   `nationality`, `employment_status`, `risk_category`.
-   `corporate_client_flag`, `client_group_id`.
-   `client_lifetime_value`, `client_satisfaction_score`.
-   `gdpr_consent_status`, `marketing_consent_flag`, `marketing_source`.

### 4. `Adviser` (Shared Core Model)
Represents a consultant/adviser.

-   `name`, `adviser_id`, `fca_reference_number`, `status` (e.g., Experienced, CAS).
-   `club`, `agency_number`, `region`, `contact_details`.
-   `license_number`, `hierarchy_level`, `parent_agency_id`, `role_type`.
-   `active_flag`, `start_date`, `termination_date`, `aml_check_status`.

### 5. `Commission`
Represents the main procuration fee received from the lender for a `MortgageCase`.

-   `mortgage_case`: A One-to-One link to the mortgage deal.
-   `gross_commission`, `net_commission`: The core commission amounts.
-   `adviser_fee_percentage`, `adviser_fee_amount`: Calculation of the adviser's share.
-   `payment_status`, `date_received`, `date_paid_to_adviser`: Fields for tracking the payment lifecycle.
-   `vat_included` (BooleanField), `commission_invoice_number` (CharField).
-   `currency_code` (CharField), `payment_method` (CharField), `payment_reference` (CharField).
-   `payment_attachment_links` (JSONField).

### 6. `BrokerFee`
A new model to handle the two-stage fee charged to the client.

-   `mortgage_case`: ForeignKey to the deal.
-   `stage`: The stage at which the fee is charged ('AIP' for Agreement in Principle, 'OFFER' for Mortgage Offer).
-   `amount`, `status`, `date_invoiced`, `date_paid`: Fields to track the fee payment.

### 7. `CommissionModifier` (Shared Abstract Model)
A flexible base for all financial adjustments, with concrete implementations for the mortgage context.

-   `commission` (ForeignKey to `Commission`).
-   `amount` (DecimalField, +/-), `reason` (CharField), `created_at` (DateTimeField).
-   `status` (CharField), `document_links` (JSONField), `audit_trail_links` (JSONField).

#### Concrete Implementations:

-   `MortgageRetention`: For holding back part of a commission.
-   `MortgageClawback`: For handling commission returns if a deal falls through.
-   `MortgageBonus`: For performance-based bonuses.
-   `MortgageOverride`: For manager/upline commission shares.
-   `MortgageReferralFee`: To track multiple referral fees from various sources (e.g., solicitors, surveyors).

---

## Proposed API Architecture & Features

This section details the proposed features to build a professional-grade API for the mortgage module.
