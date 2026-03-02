<!-- SOCIAL PREVIEW -->
<p align="center">
  <img src="https://socialify.git.ci/MayankOps/tg-storage-engine/image?custom_language=Node.js&font=Rokkitt&language=1&name=1&owner=1&theme=Dark" />
</p>

<h1 align="center">TG Storage Engine</h1>

<p align="center">
A production-ready open-source Telegram storage backend built with Node.js.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green">
  <img src="https://img.shields.io/badge/License-MIT-blue">
  <img src="https://img.shields.io/badge/Status-Active-success">
  <img src="https://img.shields.io/badge/Storage-Telegram-blueviolet">
</p>

---

## 🚀 Overview

**TG Storage Engine** converts Telegram into a secure cloud storage backend.

Files uploaded to the server are automatically stored inside a private Telegram channel and served through secure token-based download links.

✔ No Telegram redirects  
✔ No exposed bot tokens  
✔ Direct streaming downloads  

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/bf439bc6-a4aa-4f97-afe8-81a2f49bafe5" width="45%" />
  <img src="https://github.com/user-attachments/assets/5fced711-1c5c-4b41-925d-3a9a6caaeae3" width="45%" />
</p>



## ✨ Features

- 📤 Upload any file type
- ☁️ Telegram-powered storage backend
- 🔐 Secure token-based downloads
- ⚡ Direct streaming file delivery
- 🧾 Original filename preservation
- 🌐 Built-in Web UI uploader
- 🔌 REST API support
- 🗄 SQLite metadata storage
- ♻️ Automatic temporary file cleanup
- 🔄 Upload retry protection

---

## 🧠 Architecture

```
User Upload
     │
     ▼
Node.js API (TG Storage Engine)
     │
     ▼
Telegram Bot API
     │
     ▼
Private Telegram Channel (Storage)
     │
     ▼
Secure Token Download
```

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/MayankOps/tg-storage-engine.git
cd tg-storage-engine
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment

Create `.env` file:

```
PORT=3000
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
CHANNEL_ID=-100XXXXXXXXXX
```

---

### 4️⃣ Start Server

```bash
node server.js
```

Open:

```
http://localhost:3000
```

---

## 🖥 Web Interface

Upload files directly from browser:

```
http://localhost:3000
```

Features:

- File picker upload
- Automatic download link generation
- Works with all file types

---

## 🔌 API Usage

### Upload File

```
POST /api/upload
```

Example:

```bash
curl -X POST -F "file=@example.zip" http://localhost:3000/api/upload
```

Response:

```json
{
  "success": true,
  "token": "TOKEN",
  "download": "/api/d/TOKEN"
}
```

---

### Download File

```
GET /api/d/:token
```

Example:

```
http://localhost:3000/api/d/TOKEN
```

---

### File Info

```
GET /api/info/:token
```

---

## 📁 Project Structure

```
tg-storage-engine
│
├── public/            # Web UI
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── config/
│
├── uploads/           # Temporary upload storage
├── database.db        # Metadata database
├── server.js
└── package.json
```

---

## 🔐 Security

- Bot token never exposed
- Telegram links hidden
- Token-based secure access
- Temporary files auto-deleted
- Server acts as streaming proxy

---

## ⚙️ Supported File Types

All file types supported:

```
zip, mp4, pdf, exe, apk, iso, images, documents, binaries, etc.
```

(Max size depends on Telegram Bot API limits.)

---

## 🚀 Deployment

Recommended architecture:

```
Internet
   │
   ▼
NGINX (optional reverse proxy)
   │
   ▼
Node.js TG Storage Engine
   │
   ▼
Telegram Storage Channel
```

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Telegram Bot API
- SQLite
- Multer
- Axios

---

## 🤝 Contributing

Contributions are welcome.

1. Fork repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

---

## ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🍴 Fork it
- 🧠 Share ideas

---

## 📜 License

MIT License

---

## 👨‍💻 Author

- **Author**: ‎[MayankOps](https://github.com/MayankOps)
- **Email**: ‎[contactmayank@aol.com](mailto:contactmayank@aol.com)

---

<p align="center">
Built with ❤️ using Node.js & Telegram
</p>
