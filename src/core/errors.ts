type ErrorMessageFn = (vars?: unknown) => string;

type ErrorTypes = 
    | 'InvalidCard'
    | 'InvalidPlayer';
const ErrorMessages: Record<ErrorTypes, ErrorMessageFn> = {
    InvalidCard: (v) => `No card at index '${v}' in 'AllCardTypesFactory'`,
    InvalidPlayer: (v) => `No player at index '${v}'`,
};

export class AppError extends Error {
    override name: ErrorTypes;
    cause?: unknown;

    constructor(
        name: ErrorTypes,
        vars?: unknown,
        customMessage?: string,
        cause?: unknown
    ) {
        const finalMessage = customMessage || ErrorMessages[name](vars);
        super(finalMessage);

        this.name = name;
        this.cause = cause;
    }

    toJSON() {
        const json: Record<string, unknown> = {
            name: this.name,
            message: this.message,
        };

        if (this.cause !== undefined) {
            json.cause = this.cause;
        }

        return json;
    }
}
