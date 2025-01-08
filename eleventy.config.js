const pluginRss = require("@11ty/eleventy-plugin-rss");
module.exports = eleventyConfig => {
    eleventyConfig.addPlugin(pluginRss);

    eleventyConfig.addPassthroughCopy("styles/bundle.css");
    eleventyConfig.addPassthroughCopy("styles/index.css");

	eleventyConfig.addShortcode('excerpt', post => extractExcerpt(post)); // for {{ exerpt <post> }}
	function extractExcerpt(post) {
		if(!post.templateContent) return ''; // Check if the post has text
		if(post.templateContent.indexOf('</p>') > 0) {
			let end = post.templateContent.indexOf('</p>'); 
			return post.templateContent.substr(0, end+4); 
		}
		return post.templateContent;
	}

	eleventyConfig.addCollection("categories", function(collectionApi) {
		let categories = new Set();
		let posts = collectionApi.getFilteredByTag('post');
		posts.forEach(p => {
			let cats = p.data.categories;
			cats.forEach(c => categories.add(c));
		});
		return Array.from(categories);
	});

	eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
		/*
		case matters, so let's lowercase the desired category, cat
		and we will lowercase our posts categories
		*/
		cat = cat.toLowerCase();
		let result = posts.filter(p => {
			let cats = p.data.categories.map(s => s.toLowerCase());
			return cats.includes(cat);
		});

		return result;
	});

	return {
		dir: {
			input: 'blog'
		}
	}

};
