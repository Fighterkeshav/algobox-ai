import { xssChallenge } from "./challenges/xss";
import { sqlInjectionChallenge } from "./challenges/sqlInjection";
import { idorChallenge } from "./challenges/idor";
import { SecurityChallenge } from "./types";

export const ALL_CHALLENGES: SecurityChallenge[] = [
    xssChallenge,
    sqlInjectionChallenge,
    idorChallenge
];

export const getChallengeById = (id: string) => ALL_CHALLENGES.find(c => c.id === id);
