# 💬 Realtime Chat Application

A simple and modern **Realtime Chat App** built using **React** and **Firebase**.  
It allows users to send and receive messages instantly with live updates using Firebase Firestore.

---

## 🚀 Features

- 🔥 Real-time messaging with Firebase  
- 👤 Google Authentication (via Firebase Auth)  
- 💾 Persistent chat history  
- 📱 Responsive UI built with React  
- ⚡ Fast and lightweight setup  

---

## 🛠️ Tech Stack

- **Frontend:** React  
- **Backend:** Firebase (Firestore + Auth)  
- **Styling:** CSS / TailwindCSS  

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/bhanu1232/Real_chat.git
cd Real_chat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database** and **Authentication (Google Sign-In)**  
4. Get your Firebase config and add it to an `.env` file:
   ```bash
   REACT_APP_API_KEY=your_api_key
   REACT_APP_AUTH_DOMAIN=your_auth_domain
   REACT_APP_PROJECT_ID=your_project_id
   REACT_APP_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_APP_ID=your_app_id
   ```

### 4. Run the App
```bash
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Folder Structure
```
src/
 ┣ components/
 ┃ ┣ ChatRoom.jsx
 ┃ ┣ Message.jsx
 ┃ ┗ Navbar.jsx
 ┣ firebase.js
 ┣ App.jsx
 ┗ index.jsx
```

---

## 🧠 Future Enhancements
- ✅ Add chat rooms / group chats  
- ✅ Typing indicators  
- ✅ Message read receipts  
- ✅ File / image sharing  

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author
**Bhanuprakash**  
Frontend Developer | React & Firebase  
[GitHub](https://github.com/bhanu1232)

"# Real_chat" 
