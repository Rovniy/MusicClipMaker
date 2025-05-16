import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";
import {corsHandler} from "../utils/env";

export const createJob = functions
    .https
    .onRequest(async (req, res) => {
        corsHandler(req, res, async () => {
            if (req.method !== "POST") {
                res.status(405).send("Method Not Allowed");
                return;
            }

            const {userId, settings} = req.body;
            if (!userId || !settings) {
                res.status(400).send("Missing parameters");
                return;
            }

            const db = admin.firestore();
            const storage = admin.storage().bucket();

            const jobRef = await db.collection("jobs").add({
                userId,
                settings,
                status: "queued",
                createdAt: FieldValue.serverTimestamp(),
            });

            const [audioUpload] = await storage
                .file(`uploads/${jobRef.id}/audio.mp3`)
                .getSignedUrl({
                    version: "v4",
                    action: "write",
                    expires: Date.now() + 15 * 60 * 1000,
                    contentType: "application/octet-stream",
                });

            const [coverUpload] = await storage
                .file(`uploads/${jobRef.id}/cover.jpg`)
                .getSignedUrl({
                    version: "v4",
                    action: "write",
                    expires: Date.now() + 15 * 60 * 1000,
                    contentType: "application/octet-stream",
                });

            res.status(200).json({
                jobId: jobRef.id,
                uploadUrls: {audio: audioUpload, cover: coverUpload},
            });
        });
    });
