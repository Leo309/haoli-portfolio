# Independent Projects

## E-Commerce Growth Analytics Platform

GitHub: github.com/Leo309/ecommerce-analytics

This project was motivated by Skynex Digital consulting engagements. Hao built it end-to-end with simulated data modeled after real DTC/SaaS business scenarios.

### Architecture

Hao built an end-to-end Medallion architecture pipeline (Bronze → Silver → Gold) in Microsoft Fabric, ingesting multi-channel DTC e-commerce data (Shopify CSV, Amazon TSV, TikTok XLSX) into a unified Star Schema (Kimball) data model. This unified 3-channel data (approximately 10K orders, 14 products) into a single analytical layer enabling cross-platform comparison.

### ETL / PySpark

Hao engineered PySpark transformations handling cross-platform SKU mapping (conformed dimensions), Amazon EAV-to-wide pivot, multi-currency normalization (CAD→USD), and data quality remediation (duplicates, nulls, format inconsistencies). The result was clean, analysis-ready fact and dimension tables from 4 heterogeneous source files.

### Visualization

Hao designed a 3-page Power BI executive dashboard (DirectLake mode) covering GMV trends, product performance, channel profitability, and Shopify cohort retention analysis. This provided full executive-level visibility into revenue, margins, and channel mix across all platforms.

### Data Modeling

Hao implemented conformed dimension tables (dim_products, dim_customers) and fact tables (fact_orders, fact_financials) enabling cross-platform product performance and financial comparison. The star schema supports drill-down from channel-level to SKU-level analysis.

## SaaS Feature Adoption Analytics

GitHub: github.com/Leo309/saas-product-analytics

This project was also motivated by Skynex Digital consulting work, built with simulated data modeled after real SaaS business scenarios.

### dbt / BigQuery

Hao built a dbt Staging-Marts transformation layer in BigQuery analyzing AI feature launch adoption (approximately 2,000 users, approximately 200K events). He implemented 26 automated dbt tests (unique, not_null, accepted_values, relationships). The result was governed, tested data models with full lineage from raw to business-ready tables.

### Product Analysis

Hao designed an adoption funnel (exposed → first_use → repeat_use), 30/60/90-day non-cumulative cohort retention, and DAU/MAU stickiness ratio. Analysis revealed 36% adoption rate with 84.7% → 72.6% retention decay (30d → 90d). This provided actionable insights identifying enterprise users as fastest adopters and repeat usage as key retention driver.

### Orchestration

Hao configured an Apache Airflow DAG (Docker Compose) orchestrating the dbt pipeline: deps → staging → marts → test → docs_generate. Scheduled daily at 6AM UTC with retry logic. This created a fully automated, reproducible analytics pipeline with built-in quality gates.

### SQL Techniques

Hao applied window functions (ROW_NUMBER for dedup, DATE_DIFF for time-to-adopt), SAFE_DIVIDE, APPROX_QUANTILES for median, and multi-CTE cohort queries with non-cumulative retention windows. This produced accurate funnel conversion rates and cohort comparison metrics with zero division errors.
