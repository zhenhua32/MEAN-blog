var hbs = require('hbs');

hbs.registerHelper('userPaperList', function (items, options) {
	var part1 = '<div class="card"><div class="card-content white-text"><span class="card-title">';
	var part2 = '</span></div><div class="card-action"><a href="';
	var part3 = '">';
	var part4 = '</a><span>';
	var part5 = '</span>';
	var part6 = '<a href="';
	var part7 = '" class="right"><i class="material-icons right">edit</i>编辑</a></div></div>';



	var out = '';
	for (var i = 0; i < items.length; i++) {
		out = out + part1 + items[i].title + part2 + '#' + part3 + items[i].author
		+ part4 + items[i].createdAt + part5 + part6 + '/user/' + items[i].author
		+ '/edit?q=' + items[i].title  + part7 + '\n';
	}

	return out;
});

hbs.registerHelper('userPaperContent', function (items, options) {
	var part1 = '<div class="col s7 paper_content"><h1>';
	var part2 = '</h1><pre>';
	var part3 = '</pre></div>';

	var out = '';
	for (var i = 0; i < items.length; i++) {
		out = out + part1 + items[i].title + part2 + items[i].body + part3 + '\n';
	}

	return out;

});