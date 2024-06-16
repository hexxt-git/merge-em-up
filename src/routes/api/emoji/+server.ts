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

	let attempts = 5;
	let success = false;
	let response: string = '⛔';
	
	while (attempts > 0 && !success) {
		try {
			const result = await model.generateContent(JSON.stringify(prompt));
			response = result.response.text();
			success = true;
		} catch (error) {
			console.log({word, attempts, error});
			attempts -= 1;
			await new Promise(r => setTimeout(r, 2000))
		}
	}

	return new Response(response, {
		headers: { 'Content-Type': 'application/json' },
	});
}
