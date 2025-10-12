import { Logger } from "tslog";

export function createLogger(scope: string) {
    return new Logger({
        name: scope,
        type: "pretty", // enables colorized, human-readable output
        hideLogPositionForProduction: true, // hides file:line location in logs
        // displayFunctionName: false,
        // displayLoggerName: true,
        // displayFilePath: "hidden", // file path not shown in logs
    });
}

const logger = createLogger("app");
export default logger;