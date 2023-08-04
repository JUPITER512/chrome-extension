require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function createTranscription(audioFileName) {
	const resp = await openai.createTranscription(
	  fs.createReadStream(audioFileName),
	  "whisper-1"
	);

	return resp.data.text;
}

async function main() {
	try {
		const audi
		const transcription = await createTranscription(audioFileName);
		console.log(transcription);
	} catch (e) {
		console.error(e);
	}
}

main();