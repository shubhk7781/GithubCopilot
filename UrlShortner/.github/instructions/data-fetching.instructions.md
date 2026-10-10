---
description: read this file to understand how to fetch data in this project.
---
# Fetching Data
This document outlines the best practices for fetching data in this next.js project. Adhere to these guidelines will ensure consistency and maintainability across the codebase.

## 1. use server components for data fetching

In Next.js, always prefer using server components for data fetching whenever possible. Never fetch data on the client side unless it is absolutely necessary for interactivity or real-time updates.

## 2. Data Fetching Methods
Always use the helper functions in the /data directory to fetch data. Never fetch data directly from external APIs or databases in your components.

All helper methods in the /data directory should use Drizzle ORM for database interactions.