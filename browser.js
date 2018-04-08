// tooling
const postcss = require('postcss');
const plugin = require('..');

// parse <style> after running its contents through a PostCSS plugin
const updateStyle = style => {
	postcss([
		plugin({
			stage: 0
		})
	]).process(style.textContent, {
		from: style.className
	}).then(
		result => postcss().process(result.css, {
			from: style.className
		})
	).then(
		result => {
			style.textContent = result.css;
		},
		console.error
	);
};

// update any pre-existing <style> in <head> using the PostCSS plugin
const styles = document.head.getElementsByTagName('style');

if (styles.length) {
	Array.prototype.filter.call(
		styles,
		node => node.nodeName === 'STYLE' && node.className === 'cp-pen-styles'
	).concat(styles[0]).slice(0, 1).forEach(updateStyle);
}

// watch for and update any new <style> in <head> using the PostCSS plugin
(new MutationObserver(
	mutations => mutations.forEach(
		mutation => Array.prototype.filter.call(
			mutation.addedNodes || [],
			node => node.nodeName === 'STYLE' && node.className === 'cp-pen-styles'
		).forEach(updateStyle)
	)
)).observe(
	document.head,
	{
		childList: true
	}
);
