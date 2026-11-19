// ==========================================
// CONEXIÓN DE FIREBASE - GREEN ARQUI
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyD--lDRISE957h3vaO6mDcdwLhEZ8JGXiE",
  authDomain: "green-arqui.firebaseapp.com",
  projectId: "green-arqui",
  storageBucket: "green-arqui.firebasestorage.app",
  messagingSenderId: "237700686758",
  appId: "1:237700686758:web:cda7b339f6a71626cde567",
  measurementId: "G-BT1EW1G7ER"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para utilizar en otros archivos
export { app, auth, db };