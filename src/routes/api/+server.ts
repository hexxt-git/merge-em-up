import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminikey, dbHOST, dbPASSWORD } from '$env/static/private';

export const _genAI = new GoogleGenerativeAI(geminikey);

import { createClient } from "@libsql/client";

export const _db_connection = createClient({
	url: dbHOST,
	authToken: dbPASSWORD,
});
console.log('Connected to the turso server.');

export function GET() {
	return new Response(
		'available endpoints are \n /api/database returns the contents of the database in json \n /api/merge?word1={string}&word2={string} returns the merged words \n /api/emoji?word={string} returns an appropriate emoji'
	);
}

