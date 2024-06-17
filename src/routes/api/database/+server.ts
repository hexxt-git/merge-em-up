import { _db_connection } from '../+server';

export async function GET() {
	try {
		const words_res = await _db_connection.execute({sql: 'select * from words', args: []});
		const words = words_res.rows
		const emoji_res = await _db_connection.execute({sql: 'select * from emojis', args: []});
		const emojis = emoji_res.rows
		return new Response(JSON.stringify({ words, emojis }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('error querying database', error);
		return new Response('Failed querying database', { status: 500 });
	}
}
