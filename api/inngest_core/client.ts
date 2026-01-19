import { Inngest, EventSchemas } from "inngest";
import { type Events } from "./events.js";

export const inngest = new Inngest({
    id: "algobox-ai",
    schemas: new EventSchemas().fromRecord<Events>(),
});
