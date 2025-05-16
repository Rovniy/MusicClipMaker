import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics";

export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyCsxlSYkcC6D0GeUmMX9sSKCGGjWfoQgLE",
        authDomain: "visualizationmaker-b8ff1.firebaseapp.com",
        databaseURL: "https://visualizationmaker-b8ff1-default-rtdb.firebaseio.com",
        projectId: "visualizationmaker-b8ff1",
        storageBucket: "visualizationmaker-b8ff1.firebasestorage.app",
        messagingSenderId: "1032887726025",
        appId: "1:1032887726025:web:1480407fbdc85e5c41c218",
        measurementId: "G-7S3JR3JK25"
    };

    const app = initializeApp(firebaseConfig)

    if (import.meta.server) return

    getAnalytics(app)
})