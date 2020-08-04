export default (context, inject) => {
    const string = {
        title(value) {
            let result = value.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
    
            return result;
        },

        paddy(num, padlen = 2, padchar = '0') {
            var pad_char = typeof padchar !== "undefined" ? padchar : "0";
            var pad = new Array(1 + padlen).join(pad_char);
            return (pad + num).slice(-pad.length);
        }
    }

    inject('string', string);
    context.$string = string;
}