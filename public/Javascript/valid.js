String.prototype.valid = function(link){
    // eliminate possibility of whitespace
    if (link.match(/\s/)){
        return false;
    }
    var regex = [], link = link.toLowerCase(), that = this.toLowerCase(), parsedstr = that.split(/\*/),
        rebegin = /(^https?:\/\/)?(^\w[\w\-]*\w!\.)?(^\w[\w\-]*\w)?(^\.\w{2,})?(^\/.*)?/,
        reend = /(https?:\/\/$)|(\w[\w\-]*\w!\.$)|(\w[\w\-]*\w$)|(\.\w{2,}$)|(\/.*$)/,
        fullwildcard = ['(?:https?:\\/\\/)','(?:(?:\\w[\\w\\-]*\\w\\.)*)?','(?:\\w[\\w\\-]*\\w)','(?:\\.\\w{2,})','(?:\\/.*)?'],
        currentplace , combinedre, finalmatch;
    if (parsedstr.length === 1 ){
        console.log(regex);
        return (link === that);
    }
    function locate(resultbegin, resultend){
        if (resultbegin | resultend) throw new Error('Invalid use of matching tokens');
        var begin, end;
        for (var i=1; i<resultbegin.length; i++) {
            if (resultbegin[i]) {
                //becomes end point of addregex func
                begin = i - 1;
                break;
            }
        }
        for (var i=1; i<resultend.length; i++) {
            if (resultend[i]) {
                // becomes new startpoint of the NEXT addregex func
                end = i;
                break;
            }
        }
        if ((!begin | !end) | (begin > end)) throw new Error('Invalid use of matching tokens');
        return [begin, end];
    }
    function addregex(regex, num){
        for (var i = (currentplace | 1); i<num; i++){
            if(!regex[i]){
                regex.push(fullwildcard[i]);
            }
        }
    }
    function sanitize(string, exclamremove){
        //escapes out all special characters of regex
        string = string.replace(/([\/\$\\\^\*\+\?\.])/g,'\\$&');
        if (exclamremove) {
            //escapes out exclamation marks (special token to indicate sub-domain)
            string.replace(/!(?=\\\.)/g,'');
            return string;
        }  else  {
            return string;
        }

    }
    // handles an all-matching case
    if (parsedstr[0] === '') {
        regex.push('^(?:https?\\:\\/\\/)?');
        if (parsedstr[1] === '') {
            addregex(regex, fullwildcard.length)
            combinedre = new RegExp(regex.join(''));
            finalmatch = combinedre.exec(link);
            if (finalmatch === null) return false;
            return (finalmatch[0] === link);
        }
    }  else {
        regex.push(sanitize(parsedstr[0]));
    }
    for (var i = 1; i<parsedstr.length; i++){
        if (parsedstr[i]===''){
            console.log(currentplace);
            addregex(regex, fullwildcard.length);
        }  else {
            var location = locate(rebegin.exec(parsedstr[i]), reend.exec(parsedstr[i]));
            addregex(regex, location[0]);
            currentplace = location[1];
            console.log(location[0]);
            if (location[0] < 2) {
                regex.push(sanitize(parsedstr[i], true));
            }  else {
                regex.push(sanitize(parsedstr[i]));
            }
        }
    }
    combinedre = new RegExp(regex.join(''));
    finalmatch = combinedre.exec(link);
    if (finalmatch === null) return false;
    return (finalmatch[0] === link);
}
