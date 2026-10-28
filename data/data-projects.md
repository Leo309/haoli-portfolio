# Data projects

Both projects use simulated data modeled on real DTC and SaaS business scenarios, motivated by Skynex Digital consulting work.

## E-Commerce Growth Analytics Platform

GitHub: github.com/Leo309/ecommerce-analytics

This is an end-to-end analytics pipeline on Microsoft Fabric for a multi-channel DTC brand: Shopify, Amazon and TikTok Shop, with about 10K orders and 14 products.

- **Architecture**: a Medallion pipeline (Bronze → Silver → Gold) ingests Shopify CSV, Amazon TSV and TikTok XLSX files into one Kimball star schema.
- **ETL in PySpark**:
  - cross-platform SKU mapping (conformed dimensions)
  - Amazon EAV-to-wide pivot
  - CAD→USD normalization
  - cleanup of duplicates, nulls and format inconsistencies
- **Modeling**:
  - Dimension tables: `dim_products` and `dim_customers`.
  - Fact tables: `fact_orders` and `fact_financials`.
  - Analysis drills down from channel level to SKU level.
- **Dashboard**: a 3-page Power BI executive dashboard in DirectLake mode, covering GMV trends, product performance, channel profitability and Shopify cohort retention.

## SaaS Feature Adoption Analytics

GitHub: github.com/Leo309/saas-product-analytics

This project analyzes the launch of an AI feature in a B2B SaaS product, with about 2,000 users and 200K events.

- **Transformation**:
  - dbt staging and mart layers in BigQuery.
  - 26 automated tests: unique, not_null, accepted_values and relationships.
- **Analysis**:
  - an adoption funnel: exposed → first use → repeat use
  - 30/60/90-day non-cumulative cohort retention
  - DAU/MAU stickiness
- **Findings**:
  - 36% of users adopted the feature.
  - Retention decayed from 84.7% at 30 days to 72.6% at 90 days.
  - Enterprise users adopted fastest, and repeat use was the key driver of retention.
- **Orchestration**: an Airflow DAG in Docker runs deps → staging → marts → test → docs daily, with retries.
- **SQL techniques**:
  - window functions (`ROW_NUMBER` for deduplication, `DATE_DIFF` for time to adopt)
  - `SAFE_DIVIDE` and `APPROX_QUANTILES`
  - multi-CTE cohort queries
