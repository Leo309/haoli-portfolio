# Independent Projects

## AskHao — AI Agent on haoli.ai

GitHub: github.com/Leo309/haoli-portfolio

AskHao is the AI agent embedded in Hao's personal site that answers questions about his background. Hao built it on Claude's native tool use with a hand-written agentic loop instead of a framework like LangChain. Questions are embedded with OpenAI text-embedding-3-small and matched against Hao's profile in Supabase pgvector. The agent decides on its own when to call its two tools: search_background (semantic search) and get_contact_info. Built with Next.js and TypeScript, deployed on Vercel.

## GeoGrade (Skynex Digital product)

Live at geograde.ai. GeoGrade checks whether ChatGPT recommends your business. Hao built and runs it through Skynex Digital.

## CollabZen (Skynex Digital product)

Live at collabzen.ai. CollabZen is a partner management SaaS for SMBs and DTC brands, covering influencer and affiliate partner tracking, project management, deliverable performance monitoring, and automated email reminders. Built with Next.js, TypeScript, Supabase, Stripe, and Tailwind CSS.

## Real Return Analyzer (Skynex Digital product)

Live at realreturns.skynexdigital.com. GitHub: github.com/Leo309/Real-Return-Analyzer

A financial education web app that uses historical data from 7 major economies (1970–2024) to show how inflation erodes purchasing power and what different investments really returned. Supports English, Chinese, and French. Built with Next.js, React, TypeScript, Chart.js, and Zustand.

## Claude Prompt Films

GitHub: github.com/Leo309/claude-prompt-films

An experiment in AI-generated media: one prompt becomes a finished short film, with every frame drawn in code. Built with Claude Code, HTML Canvas, and the Web Audio API.

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
