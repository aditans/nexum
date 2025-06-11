# NEXUM 📚✨

A web-based resource portal for teachers and students, designed to streamline sharing, discovery, and management of educational materials. NEXUM features role-based access, discussion forums, secure file storage, and timetable management.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)
- [Acknowledgments](#acknowledgments)

---

## 📝 Project Overview

NEXUM is a collaborative platform for academic institutions, enabling:
- 👩‍🏫 **Teachers** to upload, manage, and share study materials.
- 👨‍🎓 **Students** to search, download, and discuss resources.
- 🛡️ **Admins** to oversee users, courses, and platform activity.

The system enhances learning through centralized resource management, interactive forums, and robust security.

---

## 🚀 Features

- 📂 **Resource Management:** Upload, search, download, and manage study materials (PDF, PPT, DOCX).
- 📅 **Timetable Management:** Centralized viewing and updating of course schedules.
- 💬 **Discussion Forums:** Course-specific forums for Q&A and collaboration.
- 👥 **User Management:** Role-based access for students, teachers, and admins.
- 🔒 **Security:** MFA, password hashing, RBAC, encrypted file storage, and audit logging.
- 📱 **Responsive UI:** Accessible on desktop and mobile devices.

---

## 🏗️ System Architecture

🖥️ [Frontend] <----> 🌐 [Backend API] <----> 🗄️ [MySQL Database & BLOB Storage]


---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended) 🟢
- npm 📦
- MySQL 8.0+ 🗄️
- (Optional) Cloud storage for large files ☁️

### Installation

1. **Clone the repository:**
    ```
    git clone https://github.com/aditans/nexum.git
    cd nexum
    ```
2. **Install dependencies:**
    ```
    npm install
    ```
3. **Configure environment:**
    - Copy `.env.example` to `.env` and update variables as needed.

4. **Set up the database:**
    - Import the provided SQL schema into your MySQL instance.

5. **Run the application:**
    ```
    npm start
    ```
    or
    ```
    node server.js
    ```

---

## 🎯 Usage

- 👨‍🎓 **Students:** Register/login, search/download resources, participate in forums, view timetables.
- 👩‍🏫 **Teachers:** Upload/manage resources, answer forum queries, view schedules.
- 🛡️ **Admins:** Manage users, courses, timetables, and moderate discussions.

---

## 🤝 Contributing

Contributions are welcome!  
Please fork the repository and submit a pull request.  
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License.  
See [LICENSE](LICENSE) for more information.

---

## 👥 Team

- **Aditanshu Sahu** (230953444)
- **Lakshya Agarwal** (230953416)
- **Avni Tiwari** (230953500)

---

## 🙏 Acknowledgments

- Built with Node.js, Express.js, MySQL, and modern web technologies.
- Inspired by the need for efficient academic resource sharing and collaboration.

---

> _For full technical and functional specifications, see the [Software Requirements Specification (SRS)](./SRS.md)._
