import * as admin from "firebase-admin";
import {createJob} from "./createJob";
import {notifyUploadComplete} from "./notifyUpload";

// Инициализируем Admin SDK ровно один раз
admin.initializeApp();

export {createJob, notifyUploadComplete};
