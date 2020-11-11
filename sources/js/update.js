
/**
 * Updates the dom element. Creates HTML code for each Note object in the Notes array and inserts it into the dom element.
 * @param {string|object} domElement dom element on which should be working on
 * @param {Note[]} notes Array of Notes objects
 * @param {object} settings settings object
 */
function updateNoteArea(domElement, notes, settings){
    // get dom element
    if (typeof domElement == 'string') domElement = document.querySelector(domElement);

    // note area is cleared
    domElement.innerHTML = "";

    // id is defined for each note
    notes.forEach((note, index) => note.id = index);

    // FIX: notes can't be sorted if date is ""
    notes.forEach((note) => {
        if (note.date == ""){
            let date = new Date();
            note.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
    });

    // notes are sorted into important, normal, checked
    let notesImportant = notes.filter(note => note.important && !note.checked),
        notesNormal = notes.filter(note => !note.important && !note.checked),
        notesChecked = notes.filter(note => note.checked);

    // notes are sorted by settings.sort (e.g. date)
    notesImportant = sortByProperty(notesImportant, settings.sorting[0], settings.sorting[1]);
    notesNormal = sortByProperty(notesNormal, settings.sorting[0], settings.sorting[1]);
    notesChecked = sortByProperty(notesChecked, settings.sorting[0], settings.sorting[1]);

    // notes is now an empty array
    notes = [];

    // if the filter options are true, the associated arrays are pushed to notes
    if (settings.visible.important) notesImportant.forEach(note => {notes.push(note);});
    if (settings.visible.normal) notesNormal.forEach(note => {notes.push(note);});
    if (settings.visible.checked) notesChecked.forEach(note => {notes.push(note);});

    // html code is generated for every note in notes
    let noteAreaHtml = '';

    notes.forEach(note => noteAreaHtml += note.html);

    // HTML of the dom element is specified
    domElement.innerHTML = noteAreaHtml;

    document.querySelectorAll('.btnEdit').forEach(element => element.addEventListener('click', (event) => {
        let windows = document.querySelector('#windows');
        windows.style.display = '';
        windows.querySelectorAll(':scope > :not(#background)').forEach(element => element.style.display = 'none');
        windows.querySelector(':scope > #note-menu').style.display = '';
        global.onWorkingId = document.querySelector('.btnEdit:focus').parentElement.parentElement.getAttribute('id');
    }));
}

/**
 * from: {@link https://stackoverflow.com/a/4698083}
 * @param {*} objArray Array which should be sorted
 * @param {string} prop key of the object in array
 * @param {number} direction 
 */
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