import { _genAI } from '../+server';

const model = _genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
	systemInstruction: `
    you are an artificial intelligence in charge of an a merging game.
    the game goes as follow: the player chooses any two cards to combine and you come up with what comes out as a result. there are no rules on what to merge so anything is possible
    the results of these combinations can be absolutely anything that makes sense from the inputs. this includes any pop culture references, scientific terms and everyday things.
    the results can as well be jokes and have a funny meaning like a pun
    the input format is exactly this JSON format: {name1: string, name2: string}
    the output format is exactly this JSON format: {name: string, icon: string}
    DO NOT include any other punctuation other than the JSON format
    the icons are relevant emojis and all the names are strings that are no longer than three words.
`.replaceAll(/ +/g, ' '),
});

export async function GET({ url }) {
	const name1 = url.searchParams.get('name1') || 'unknown';
	const name2 = url.searchParams.get('name2') || 'unknown';
	const prompt = { name1, name2 };

	let attempts = 0;
	let success = false;
	let response: string = '{"name": "error", "icon": "⚠️"}';
	
	while (attempts < 10 && !success) {
		try {
			const result = await model.generateContent(JSON.stringify(prompt));
			response = result.response.text();
			success = true;
		} catch (error) {
			console.log({name1, name2, attempts, error});
			attempts += 1;
			await new Promise(r => setTimeout(r, 3000))
		}
	}
	
	return new Response(response, {
		headers: { 'Content-Type': 'application/json' },
	});
}
