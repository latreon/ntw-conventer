var th = ['', 'min', 'milyon', 'milyard', 'trilyon'];
var dg = ['sıfır', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
var tn = ['on', 'on bir', 'on iki', 'on üç', 'on dörd', 'on beş', 'on altı', 'on yeddi', 'on səkkiz', 'on doqquz'];
var tw = ['iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];


export const convertToWord = (number) => {
    if (number != Number(number)) return 'not a number';
    number = number.toString();
    number = number.replace(/[\, ]/g, '');
    if (number != parseFloat(number)) return 'not a number';
    var hasFraction = number.indexOf('.');
    if (hasFraction == -1)
        hasFraction = number.length;
    var arr = number.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < hasFraction; i++) {
        if ((hasFraction - i) % 3 == 2) {
            if (arr[i] == '1') {
                str += tn[Number(arr[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (arr[i] != 0) {
                str += tw[arr[i] - 2] + ' ';
                sk = 1;
            }
        } else if (arr[i] != 0) {
            str += dg[arr[i]] + ' ';
            if ((hasFraction - i) % 3 == 0) str += 'yüz ';
            sk = 1;
        }
        if ((hasFraction - i) % 3 == 1) {
            if (sk)
                str += th[(hasFraction - i - 1) / 3] + ' ';
            sk = 0;
        }
        if (arr[0] == 0) {
            str = "sıfır"
        }
    }
    if (hasFraction != number.length) {
        var len = number.length;
        str += ' tam ';
        for (var i = hasFraction + 1; i < len; i++)
            str += dg[arr[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}