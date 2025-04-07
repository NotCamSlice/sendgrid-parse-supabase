# 📬 SendGrid Parse Webhook Handler (TypeScript)

A lightweight TypeScript-based service for capturing incoming emails via SendGrid's Inbound Parse Webhook and storing them in a database for later use.

> ⚠️ This project was originally developed as a temporary solution for [GTAPoliceMods](https://gtapolicemods.com) and is now being open-sourced after my departure from the team. Feel free to use, improve, and build on it!

---

## 💡 Features

- Built in **TypeScript** for type safety and maintainability
- Handles **SendGrid Inbound Parse Webhook** payloads
- Saves parsed email data into a **database** (configurable)
- Lightweight and easily extendable
- Clean, minimal structure suitable for production use or prototyping

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- A database (e.g., MongoDB, PostgreSQL, MySQL – depending on your adapter)
- A SendGrid account with Inbound Parse Webhook configured

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/sendgrid-parse-ts.git
cd sendgrid-parse-ts
npm install
