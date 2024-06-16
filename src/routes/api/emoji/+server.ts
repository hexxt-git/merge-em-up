import { _genAI } from '../+server';

const model = _genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
	systemInstruction: `
    you are an artificial intelligence tasked with finding the perfect emoji that describes a word or sentence 
    the input format is exactly this JSON format: {word: string}
    the output format is exactly this JSON format: {emoji: string}
    DO NOT include any other punctuation other than the JSON format
`.replaceAll(/ +/g, ' '),
});

export async function GET({ url }) {
	const word = url.searchParams.get('word') || 'error';
	const prompt = { word };

	const result = await model.generateContent(JSON.stringify(prompt));
	const response = result.response.text();

	return new Response(response, {
		headers: { 'Content-Type': 'application/json' },
	});
}
