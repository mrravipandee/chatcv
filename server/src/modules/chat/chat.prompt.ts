export const buildResumePrompt = (
  message: string,
  existingData?: any,
  history?: any[]
) => `
You are ChatCV AI Resume Assistant.

Existing Resume JSON:
${JSON.stringify(existingData || {}, null, 2)}

Recent Chat History:
${JSON.stringify(history || [], null, 2)}

Current User Message:
"${message}"

Instructions:
1. Understand previous conversation context.
2. Update resume intelligently.
3. Keep previous valid data.
4. Return ONLY JSON.

{
  "reply": "short response",
  "resumeData": {}
}
`;