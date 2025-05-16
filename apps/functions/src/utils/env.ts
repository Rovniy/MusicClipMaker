import cors from "cors";
import {config} from "./config";

// инициализуем один раз
export const corsHandler = cors({origin: config.webDomain});
