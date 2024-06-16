import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminikey } from '$env/static/private';

export const _genAI = new GoogleGenerativeAI(geminikey);
