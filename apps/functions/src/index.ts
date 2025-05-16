import * as admin from "firebase-admin";
import {createJob} from "./handlers/createJob";
import {notifyUploadComplete} from "./handlers/notifyUpload";

 // Инициализируем Admin SDK ровно один раз
admin.initializeApp();

export {createJob, notifyUploadComplete};
