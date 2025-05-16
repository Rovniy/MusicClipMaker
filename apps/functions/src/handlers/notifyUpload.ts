import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {PubSub} from "@google-cloud/pubsub";
import {FieldValue} from "firebase-admin/firestore";
import {corsHandler} from "../utils/env";

const pubsub = new PubSub();
const TOPIC = "jobs-to-process";

export const notifyUploadComplete = functions
    .https
    .onRequest(async (req, res) => {
        corsHandler(req, res, async () => {
            try {
                if (req.method !== "POST") {
                    res.status(405).send("Method Not Allowed");
                    return;
                }

                const {jobId} = req.body;
                if (!jobId) {
                    res.status(400).send("Missing jobId");
                    return;
                }

                await admin.firestore().doc(`jobs/${jobId}`).update({
                    status: "uploaded",
                    uploadedAt: FieldValue.serverTimestamp(),
                });

                await pubsub.topic(TOPIC).publishMessage({
                    json: {jobId},
                });

                res.status(200).json({success: true});
            } catch (error: unknown) {
                console.error("notifyUploadComplete error:", error);
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).send(message);
            }
        });
    });
