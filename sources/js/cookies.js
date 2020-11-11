

/**
 * get cookie
 * @param {string} name name of cookie
 * @param {boolean} json if true, the value of cookie is parsed
 * @returns {object} if key is in cookies, {key, value}; if not, {}; if key is in cookies and json is true, value is already parsed
 */
function getCookie(name, json){

    let cookies = document.cookie.split(';'),
        cp = [],
        searchedCookie = {};

    cookies.forEach((cookieparts) => {
        cp = cookieparts.split('=');
        if (name == cp[0].trim()) {
            searchedCookie = {key: cp[0].trim(), value: decodeURIComponent(cp[1])};
        }
    });

    if (typeof searchedCookie.key == 'undefined') return {key: null, value: null};
    else if (json) return {key: searchedCookie.key, value: JSON.parse(searchedCookie.value)};
    else return searchedCookie;

}

/**
 * set cookie
 * @param {string} key 
 * @param {string} value required when setting cookie
 */
function setCookie(key, value){   
    let cookie = key + '=' + encodeURIComponent(value) + `; max-age= ${60*60*24*30}; path=/;`;
    document.cookie = cookie;    
}

/**
 * Compares the value of a cookie with compare
 * @param {string} name name of cookie
 * @param {object|string} compare to compare with the value of cookie
 */
function compareCookie(name, compare){
    let cookieVal = (typeof compare == 'string') ? getCookie(name).value : getCookie(name, true).value;
    if (cookieVal == compare) return false;
    else return true;
}

/**
 * download a cookie as file
 * @param {String} name name of cookie
 */
function downloadCookie(name){
    let text = getCookie(name).value;
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `cookie_${name}_download.json`);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

/**
 * Set a cookie with the value of the file
 * @param {String} name name of the cookie
 * @param {String} filename path to the file
 */
function uploadToCookie(name, filename){
    // TODO: complete
}