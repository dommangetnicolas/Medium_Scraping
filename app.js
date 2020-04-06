const cheerio = require('cheerio');
const axios = require('axios');

const siteUrl = 'https://www.boursorama.com/bourse/indices/cours/historique/1rPCAC';

const fetchData = async () => {
	const result = await axios.get(siteUrl);
	return cheerio.load(result.data);
};

// Scraping method
const scrape = async () => {
	const $ = await fetchData();

	// Get the column names
	const keys = [];
	await $('*[data-period-history-view] .c-table > thead > tr').each((index, element) => {
		$('th', element).each((idx, el) => {
			keys.push($(el).text().replace(/\s/g, ''));
		});
	});

	// Get each lines of the table
	const data = [];
	await $('*[data-period-history-view] .c-table > tbody > tr').each((index, element) => {
		const object = {};

		$('td', element).each((idx, el) => {
			object[keys[idx]] = $(el).text().replace(/\s/g, '');
		});

		data.push(object);
	});

	return data;
};

scrape().then((tte) => console.log(tte));
