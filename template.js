// TradingView task
// Kuvakin Sergey (https://github.com/lafin)

var templateEngine = (function () {

    // private
    function renderBlock(template, data) {
        var endBlockPattern = '{% / %}';

        var start = template.search(/%\}/gi),
            end = template.lastIndexOf(endBlockPattern);

        var head = template.substring(0, template.search(/\{%/gi)),
            footer = template.substring(end + endBlockPattern.length, template.length);

        template = template.substring(start + 2, end);
        if (!~template.indexOf(endBlockPattern)) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    head += template.replace(/\{(%|\{){1}\s*\.\s*(%|\}){1}\}/gi, data[i]);
                }
            }
        } else {
            for (var j in data) {
                if (data.hasOwnProperty(j)) {
                    head += renderBlock(template, data[j]);
                }
            }
        }

        return head + footer;
    }

    function applyFilter(filters, str) {
        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var name = filters[i].substring(1);
                if (templateEngine.hasOwnProperty(name)) {
                    str = templateEngine[name](str);
                }
            }
        }
        return str;
    }

    function parseTemplate(template, data) {
        var start = 0,
            end = 0,
            num = 0,
            offset = 0,
            name, html = '';
        template = template.replace(/\{\{\s*(\w+)(:.*?)*\s*\}\}/gi, function (str, subStr) { // simple block 
            var defaultValue = /default\((.*?)\)/.exec(str);
            var returnValue = data.hasOwnProperty(subStr) ? data[subStr] : ( !! defaultValue ? defaultValue[1] : '');
            var filters = str.match(/:\w+/gi);
            return !!filters ? applyFilter(filters, returnValue) : returnValue;
        });
        var match = template.match(/\{%\s*(\w+|\/|\.)\s*%\}/gi);
        for (var i in match) {
            if (match.hasOwnProperty(i)) {
                var pattern = /\{%\s*(.*?)\s*%\}/.exec(match[i])[1];
                if (pattern === '/') {
                    num -= 1;
                    if (num === 0) {
                        end = template.indexOf(match[i], offset) + match[i].length;
                        html += renderBlock(template.substring(start, end), data[name]);
                    } else {
                        offset = template.indexOf(match[i], offset) + match[i].length;
                    }
                } else {
                    if (num === 0) {
                        offset = start = template.indexOf(match[i]);
                        name = pattern;
                        html += template.substring(end, start);
                    }
                    num += 1;
                }
            }
        }

        return html + template.substring(end);
    }

    // public
    return {
        template: null,
        data: null,

        upper: function (str) {
            return str.toUpperCase();
        },

        lower: function (str) {
            return str.toLowerCase();
        },

        escape: function (str) {
            return str.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
        },

        trim: function (str) {
            return str.trim();
        },

        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        setTemplate: function (_template) {
            this.template = _template;
            return this;
        },
        setData: function (_data) {
            this.data = _data;
            return this;
        },
        render: function (template, data) {
            template = template || this.template;
            data = data || this.data;

            template = template.replace(/\{#(.*?)#\}/gi, ''); // comment block
            template = template.replace(/\n/gi, '###n');
            template = parseTemplate(template, data);
            return template.replace(/###n/gi, '\n');
        }
    };
}());

templateEngine.myfilter = function (str) {
    return '*** ' + str + ' ***';
};

var tpl = '<h1>Category: {{category}}</h1>\n' +
    '<h1>Category: {{category:lower:escape:trim:capitalize:upper}}</h1>\n' +
    '<h1>My filter: {{ddd:default(lololo):myfilter}}</h1>\n' +
    '<ol>\n' +
    '{# items must be non-empty for valid markup #}' +
    '{% items %}' +
    ' <li>{{ . }}</li>\n' +
    '{% / %}' +
    '</ol>\n' +
    '<table>\n' +
    '{% table %}' +
    ' <tr>\n' +
    ' {% . %}' +
    '<td>{{ . }}</td>' +
    '{% / %}' +
    '\n </tr>\n' +
    '{% / %}' +
    '</table>\n';

console.log(templateEngine.render(tpl, {
    category: 'Fruits',
    items: ['Mango', 'Banana', 'Orange'],
    table: [
        [1, 2, 3],
        [4, 5, 6]
    ]
}));