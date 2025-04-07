# 📬 SendGrid Parse Webhook Handler (TypeScript + Supabase)

A lightweight TypeScript-based webhook handler that receives and stores incoming email data from [SendGrid's Inbound Parse Webhook](https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook) into **Supabase**.

> 🛠 Originally built for [GTAPoliceMods](https://gtapolicemods.com) as a temporary internal solution. Now released for the open-source community following my departure from the team.

---

## 💡 Features

- ✅ TypeScript-first structure
- ✅ Listens for **SendGrid Inbound Parse Webhook** payloads
- ✅ Stores parsed emails in **Supabase** (PostgreSQL-backed)
- ✅ Easily extendable for custom workflows
- ✅ Optional secret key verification

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- A [Supabase](https://supabase.com) project (free tier works fine)
- A configured SendGrid Inbound Parse Webhook

---

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/sendgrid-parse-ts.git
cd sendgrid-parse-ts
npm install
