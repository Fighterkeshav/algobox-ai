import { sqlInjectionLab } from "./labs/sqlInjection";
import { mitmLab } from "./labs/mitm";
import { xssLab } from "./labs/xss";
import { idorLab } from "./labs/idor";
import { commandInjectionLab } from "./labs/commandInjection";
import { pathTraversalLab } from "./labs/pathTraversal";
import { fileUploadLab } from "./labs/fileUpload";
import { LabScenario } from "./types";

export const ALL_LABS: LabScenario[] = [
    sqlInjectionLab,
    xssLab,
    mitmLab,
    idorLab,
    commandInjectionLab,
    pathTraversalLab,
    fileUploadLab
];

export const getLabById = (id: string) => ALL_LABS.find(l => l.id === id);
