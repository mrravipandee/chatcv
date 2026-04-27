const YTOTECH_URL =
    process.env.YTOTECH_URL || "https://latex.ytotech.com/builds/sync";

export class LatexCompileError extends Error {
    log: string;
    constructor(message: string, log: string) {
        super(message);
        this.name = "LatexCompileError";
        this.log = log;
    }
}

export async function compileLatex(latexSource: string): Promise<Buffer> {
    const payload = {
        compiler: "pdflatex",
        resources: [
            {
                main: true,
                content: latexSource,
            },
        ],
    };

    let response: Response;

    try {
        response = await fetch(YTOTECH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(60000), // 60s — LaTeX compile can be slow
        });
    } catch (err: any) {
        throw new LatexCompileError(
            `Failed to reach LaTeX compiler: ${err.message}`,
            ""
        );
    }

    if (!response.ok) {
        // ytotech returns error details as JSON
        let log = "";
        try {
            const errBody = await response.json() as any;
            log = errBody?.logs || errBody?.message || JSON.stringify(errBody);
        } catch {
            log = `HTTP ${response.status}`;
        }
        throw new LatexCompileError(`LaTeX compilation failed`, log);
    }

    // Success — response body is raw PDF bytes
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}