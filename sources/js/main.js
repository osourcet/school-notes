function refresh(){
    $('#alerts').children().hide();

    if ( !checkConnection() ) $('#no-connection').show();
    if ( editNotes ) $('#no-sync').show();

    try{
        notes = JSON.parse(getCookie('school-notes')).notes;
    }
    catch(e){
        notes = [];
    }

    $('#notes').html('');

    var notes_html = '';

    notes.forEach((note, index) => note.id = index);

    var notesImportant = notes.filter(note => note.important),
        notesNormal = notes.filter(note => (!note.important && !note.checked)),
        notesChecked = notes.filter(note => note.checked);

    notesImportant = sortByProperty(notesImportant, sortSettings[0], sortSettings[1]);
    notesNormal = sortByProperty(notesNormal, sortSettings[0], sortSettings[1]);
    notesChecked = sortByProperty(notesChecked, sortSettings[0], sortSettings[1]);

    filteredNotes = [];
    if (showNotes[0]) notesImportant.forEach(note => {filteredNotes.push(note);});
    if (showNotes[1]) notesNormal.forEach(note => {filteredNotes.push(note);});
    if (showNotes[2]) notesChecked.forEach(note => {filteredNotes.push(note);});
    // notes.push(notesImportant);
    // notes.push(notesNormal);
    // notes.push(notesChecked);

    filteredNotes.forEach((item) => {
        notes_html += createNoteBox(item);
    });

    $('#notes').html(notes_html);


    // Edit
    $('.btnEdit').on('click', () => {
        $('#windows').show();
        $('#windows').children(':not(#background)').hide();
        $('#note-menu').show();
        editNoteId = $('.btnEdit:focus').parent('div').parent('div').attr('id');
    });
}

function sync(){
    
}

// FROM: https://stackoverflow.com/a/4698083
function sortByProperty(objArray, prop, direction){
    if (arguments.length<2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
    if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    const clone = objArray.slice(0);
    const direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
    const propPath = (prop.constructor===Array) ? prop : prop.split(".");
    clone.sort(function(a,b){
        for (let p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
        }
        // convert numeric strings to integers
        a = a.match(/^\d+$/) ? +a : a;
        b = b.match(/^\d+$/) ? +b : b;
        return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
    });
    return clone;
}

/**
 * create Note
 * @param {object} json 
 */
function createNote(json){
    try{
        notesObj = JSON.parse(getCookie('school-notes'));
    }
    catch(e){
        notesObj = {notes: []};
    }
    if (notesObj == null) notesObj = {notes: []};
    if (typeof notesObj.notes == 'undefined') notesObj.notes = [];
    notesObj.notes.push(json);
    setCookie('school-notes', JSON.stringify(notesObj));
    refresh();
}

function updateNote(json, id){
    notesObj = JSON.parse(getCookie('school-notes'));
    notesObj.notes[id] = json;
    setCookie('school-notes', JSON.stringify(notesObj));
    refresh();
}

function removeNote(id){
    notesObj = JSON.parse(getCookie('school-notes'));
    notes = notesObj.notes.filter(val => { return val.id != id });
    console.log(id);
    console.log(notes);
    setCookie('school-notes', JSON.stringify(notesObj));
    refresh();
}

function createNoteBox(note){
    var notebox = `
    <div id="${note.id}" class="${(note.checked) ? 'bg-success text-white' : (note.important) ? 'bg-warning' : 'bg-light'} bg-gradient p-4 box rounded m-3 col-1" >

        <!-- title -->
        <div class="mb-3 d-flex justify-content-between align-items-center">
            <h4 class="pt-1">${note.title}</h4>
            <button type="button" class="btn p-1 btnEdit" style="height: auto !important;">   
                <svg width="25" height="25" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="${(note.checked) ? 'white' : 'currentColor'}" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
        </div>
        <!-- subject -->
        <div class="mb-3">
            Fach: ${note.subject}
        </div>
        <!-- date -->
        <div class="mb-4">
            Zuerledigen bis: ${moment(note.date, 'YYYY-MM-DD').format(dateFormat)}
        </div>
        <!-- notes -->
        <div class="">
            <div class="p-1 mb-2 plain" style="display: none;">
                ${note.content}
            </div>
            <div class="p-1 markdown" id="content">
                ${markdownToHtml(note.content)}
            </div>
        </div>
    </div>

    `;

    return notebox;
}

function checkConnection(){
    return true;
}

// menu

function noteCheck(id, val){
    notesObj = JSON.parse(getCookie('school-notes'));
    notesObj.notes[id].checked = val;
    notesObj.notes[id].important = false;
    setCookie('school-notes', JSON.stringify(notesObj));
    refresh();
}

function noteEdit(id){

}

function noteRemove(id){

}

// coockies

/**
 * get cookie
 * @param {String} name
 */
function getCookie(name){

    var cookies = document.cookie.split(';'),
        cp = [],
        searchedCookie = null;

    cookies.forEach((cookieparts) => {
        cp = cookieparts.split('=');
        if (name == cp[0].trim()) {
            searchedCookie = decodeURIComponent(cp[1]);
        }
    });
    return searchedCookie;

    
}

/**
 * set cookie
 * @param {String} name 
 * @param {String} value required when setting cookie
 */
function setCookie(name, value){
    
    var cookie = name + '=' + encodeURIComponent(value) + `; max-age= ${60*60*24*30}; path=/;`;
    console.log(cookie);
    document.cookie = cookie;
    return;
    
}

// download

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

// markdown

function markdownToHtml(markdown){
    const converter = new showdown.Converter();
    showdown.setFlavor('github');

    if (markdown){
        return converter.makeHtml(markdown);
    } else {
        return;
    }
}