import { Server } from "@lib/providers/ServerProvider";
import { AginErrorCode } from "./AginErrorCode";

export type DiscoverServerResult = {
    success: boolean;
    server?: Server;
    error?: AginErrorCode;
    url: string;
};