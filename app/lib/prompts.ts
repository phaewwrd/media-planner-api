export const SUMMARY_PROMPT = (text: string) => `
Please summarize the following text and provide a comprehensive analysis.
The analysis should include:
1.  Key takeaways from the text.
2.  Any potential implications or insights.
3.  Recommendations based on the information provided.

Text to summarize and analyze:
"${text}"
`;