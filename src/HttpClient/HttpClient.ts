import fetch, { Request, Response } from 'node-fetch';

export const get = (req: Request | string): Promise<Response> => fetch(req);

export const getHtml = (req: Request | string): Promise<string> => {
	return get(req).then(res => {
		// const { charset } = contentTypeFromHeader(res);
		// console.log(charset);
		// // return decodeResponse(res, charset);
		return res.text();
	});
}

// const decodeResponse = (res: Response, charset: string): Promise<string> => {
// 	return res.arrayBuffer().then(buffer => {
// 		const decoder = new TextDecoder(charset);
// 		const isCharsetValid = decoder.encoding === charset.toLowerCase();
// 		console.log(isCharsetValid);
// 		if (!isCharsetValid) {
// 			return res.text().then((text) => unescape(encodeURIComponent(text)));
// 		}
// 		return decoder.decode(buffer);
// 	});
// }


// interface ContentType {
// 	// mediaType: string;
// 	charset: string;
// }

// const contentTypeFromHeader = (res: Response): ContentType => {
// 	const contentType = res.headers.get('content-type');
// 	console.log(contentType);
// 	// match the charset property from the content-type string
// 	const charsetProperty = (contentType?.match(/charset=[^\s]+/g) || [])[0];
// 	// extract the charset value if it exists
// 	const charset = charsetProperty?.split("=")[1].toLowerCase();
// 	return {
// 		'charset': charset || 'UTF-8'
// 	};
// }
