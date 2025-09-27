> Last Updated: 2024-05-29

# Insurance Commission Module Architecture

This document outlines the implemented architecture for the insurance commission module, designed to handle the complex requirements of the UK insurance industry. It serves as a reference for the current state of the system.

---

## Core Models

### 1. `Policy`
Each record represents a single insurance policy.

-   `policy_number` (CharField): Unique policy number from the insurer.
-   `insurer` (ForeignKey to `Insurer`): The insurance company.
-   `client` (ForeignKey to `Client`).
-   `adviser` (ForeignKey to `Adviser`).
-   `type_of_insurance` (CharField): Life, Health, Property, etc.
-   `status` (CharField): Active, Cancelled, Lapsed, In Review.
-   `start_date`, `end_date`, `renewal_date` (DateField).
-   `coverage_amount` (DecimalField).
-   `monthly_premium` (DecimalField).
-   `annual_premium_value` (DecimalField).
-   `policy_currency_code` (CharField): Currency of the policy.
-   `commission_data` (JSONField): Raw commission statement data.
-   `policy_document_links` (JSONField): Attachments, scans.
-   `digital_signature_status` (CharField): Signed, Pending, etc.
-   `client_source` (CharField): Referral, Online, Partner, etc.
-   `client_group_id` (CharField): For corporate clients.
-   `policy_coverage_details` (TextField): Additional coverage info.
-   `risk_score` (DecimalField): Internal risk assessment.
-   `policy_cancellation_reason` (TextField).
-   `policy_cancellation_date` (DateField).
-   `client_complaint_flag` (BooleanField).
-   `client_complaint_details` (TextField).
-   `cross_sell_opportunity` (BooleanField).
-   `upsell_opportunity` (BooleanField).
-   `policy_amendment_flag` (BooleanField).
-   `policy_amendment_details` (TextField).
-   `legacy_policy_flag` (BooleanField).
-   `legacy_policy_notes` (TextField).
-   `integration_id` (CharField).

### 2. `Insurer`
Represents an insurance company.

-   `name` (CharField).
-   `contact_details` (TextField).
-   `fca_reference_number` (CharField).
-   `insurer_id` (CharField).
-   `region` (CharField).

### 3. `Client`
Represents an insured party.

-   `name` (CharField).
-   `client_id` (CharField).
-   `dob` (DateField).
-   `address` (TextField).
-   `contact_details` (TextField).
-   `nationality` (CharField).
-   `employment_status` (CharField).
-   `risk_category` (CharField).
-   `corporate_client_flag` (BooleanField).
-   `client_group_id` (CharField).
-   `client_lifetime_value` (DecimalField).
-   `client_satisfaction_score` (DecimalField).
-   `gdpr_consent_status` (BooleanField).
-   `marketing_consent_flag` (BooleanField).
-   `marketing_source` (CharField).

### 4. `Adviser`
Represents a consultant/adviser.

-   `name` (CharField).
-   `adviser_id` (CharField).
-   `fca_reference_number` (CharField).
-   `status` (CharField): Experienced, CAS, etc.
-   `club` (CharField).
-   `agency_number` (CharField).
-   `region` (CharField).
-   `contact_details` (TextField).
-   `license_number` (CharField).
-   `hierarchy_level` (IntegerField).
-   `parent_agency_id` (CharField).
-   `sub_agency_id` (CharField).
-   `role_type` (CharField): Lead, Junior, Override.
-   `active_flag` (BooleanField).
-   `start_date` (DateField).
-   `termination_date` (DateField).
-   `aml_check_status` (BooleanField).

### 5. `Commission`
Represents the primary commission payment related to a policy.

-   `policy` (OneToOneField to `Policy`).
-   `gross_commission` (DecimalField).
-   `net_commission` (DecimalField).
-   `adviser_fee_percentage` (DecimalField).
-   `adviser_fee_amount` (DecimalField).
-   `payment_status` (CharField): Pending, Processed, Paid, On Hold.
-   `date_received` (DateField).
-   `date_paid_to_adviser` (DateField).
-   `vat_included` (BooleanField).
-   `commission_invoice_number` (CharField).
-   `commission_due_date` (DateField).
-   `currency_code` (CharField).
-   `currency_rate` (DecimalField).
-   `payment_method` (CharField).
-   `payment_reference` (CharField).
-   `payment_attachment_links` (JSONField).
-   `forecasted_commission` (DecimalField).
-   `commission_adjustment_reason` (TextField).
-   `automated_notification_status` (CharField).
-   `integration_id` (CharField).

### 6. `CommissionModifier` (Abstract Model)
A base for all adjustments to the main commission.

-   `commission` (ForeignKey to `Commission`).
-   `amount` (DecimalField, +/-).
-   `reason` (CharField).
-   `created_at` (DateTimeField).
-   `status` (CharField).
-   `document_links` (JSONField).
-   `audit_trail_links` (JSONField).

#### Concrete Implementations:

-   **`Retention`**
    -   `is_released` (BooleanField).
    -   `release_date` (DateField).
    -   `retention_period` (IntegerField).
-   **`Clawback`**
    -   `clawback_date` (DateField).
    -   `status` (CharField): Pending, Recovered.
    -   `clawback_period` (IntegerField).
    -   `chargeback_amount` (DecimalField).
    -   `chargeback_reason` (CharField).
    -   `write_off_amount` (DecimalField).
    -   `write_off_reason` (CharField).
    -   `write_off_date` (DateField).
-   **`Bonus`**
    -   `kpi_type` (CharField).
    -   `kpi_achieved` (BooleanField).
    -   `bonus_date_paid` (DateField).
-   **`Override`**
    -   `recipient` (ForeignKey to `Adviser`).
    -   `override_recipient_id` (CharField).
-   **`ReferralFee`**
    -   `referral_source_name` (CharField).
    -   `referral_source_type` (CharField).
    -   `referral_agreement_id` (CharField).
    -   `referral_fee_status` (CharField).
    -   `referral_fee_date_paid` (DateField).
    -   `referral_notes` (TextField).

---

## Data Entry Workflow

1.  **Onboarding (Client & Adviser)**: Create `Client` and `Adviser` records with all compliance fields (FCA, AML, GDPR, risk category, consent, etc.).
2.  **Policy Creation**: Link to existing `Client`, `Adviser`, `Insurer`. Fill all fields including risk score, amendments, legacy flags.
3.  **Commission Statement Processing**: Find `Policy`, create `Commission`, add gross/net values, invoice, payment details, VAT, currency. Store original statement in `commission_data`.
4.  **Commission Calculation & Adjustments**: System calculates fees; manager creates modifiers (`Retention`, `Clawback`, `Bonus`, `Override`, `ReferralFee`). Documentation and audit fields required.
5.  **Lifecycle Events**: Status changes, clawbacks, write-offs, releases, KPIs, notifications, digital signatures.
6.  **Complaint, Marketing & Analytics Handling**: Flags, scores, cross-sell/upsell, survey results, etc.
7.  **Integration & Document Management**: All entities support links to external IDs and attachments.

---

## Reporting Capabilities

- **Adviser Performance**: Commission breakdown (main, bonus, override, referral), retention/clawback, sold policies, retention rate, satisfaction.
- **Company Financial**: Gross/net by insurer/product, cashflow forecast, adviser payouts, profitability by insurer/type.
- **Compliance/Audit**: Full transaction and document history, FCA/AML/GDPR status, clawback/override reports, complaint analysis.
- **Policy/Insurer/Product Analysis**: Income by type/insurer, cancellation analysis, cross-sell/upsell potential, legacy book performance.

---

This architecture **maximally covers** all practical and advanced requirements for the UK insurance commission business: compliance, analytics, multi-level commission, complaints, marketing, integration, audit, and reporting.

---

## Краткое описание на русском

Этот документ описывает целевую архитектуру "топ-1" уровня для модуля управления комиссиями в страховом бизнесе Великобритании. Она спроектирована для максимального покрытия всех бизнес-требований.

### Ключевые принципы:

1.  **Максимальная детализация моделей**: Все основные сущности (`Policy`, `Client`, `Adviser`, `Commission`) расширены десятками полей. Это позволяет хранить исчерпывающее информацию для аналитики, комплаенса (FCA, GDPR), управления рисками, маркетинга и интеграций.

2.  **Гибкая структура комиссий**: Введена абстрактная модель `CommissionModifier` для всех видов финансовых корректировок. Конкретные реализации, такие как `Retention` (удержание), `Clawback` (возврат), `Bonus`, `Override` (комиссия руководителя) и `ReferralFee` (реферальная комиссия), позволяют прозрачно и точно отслеживать каждый фунт.

3.  **Четкий рабочий процесс (Workflow)**: Описан строгий пошаговый процесс ввода данных — от создания клиента и полиса до обработки выписок от страховых компаний и управления жизненным циклом полиса (отмена, продление).

4.  **Неограниченные возможности для отчетности**: Такая глубокая структура данных является фундаментом для построения любых отчетов: от персональной эффективности консультанта до комплексного финансового отчета компании, аудиторских выгрузок и аналитики по продуктам.

Эта архитектура является стратегическим ориентиром для разработки ведущей в отрасли платформы, готовой к масштабированию и самым сложным вызовам страхового рынка.
