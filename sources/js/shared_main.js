document.addEventListener('DOMContentLoaded', async () => {

    // gets id from Url query
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('app') != 'false')
        run('android', () => {
            // window.location = `http://localhost:6000/shared?id=${urlParams.get('id').toString()}`;

            window.open(`http://localhost:6000/shared?id=${urlParams.get('id').toString()}`)

            // setTimeout(() => {
            //     window.location = `${window.location.protocol}//${window.location.host}/shared?id=${urlParams.get('id').toString()}&app=false`;
            // }, 3000)
        });

    // sends post request to get the note
    let req = await fetch('/api/note/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: urlParams.get('id')})
    });

    let data = await req.json();

    if (data.status != 'success') {
        document.querySelector('#not-found').style.display = '';
    }
    // convert got json to Note
    else if (typeof data.note != 'undefined') global.notes.push(Note.toNote(data.note));
    // convert all objects in got json to Note onjects
    else if (typeof data.notes != 'undefined') data.notes.forEach(note => global.notes.push(Note.toNote(note)));

    // updates #notes with the converted note
    updateNoteArea('#notes', global.notes, global.settings);

    // +------------------+
    // |  event listener  |
    // +------------------+

    document.querySelector('#btnSave').addEventListener('click', () => {
        let notes = [];

        if(getCookie('school-notes').key != null){
            notes = getCookie('school-notes', true).value.notes;
        }

        // push the shared note to notes array
        notes.push(global.notes[global.onWorkingId].toObject());

        // saves new Notes array
        setCookie('school-notes', JSON.stringify({notes: notes}));

        document.querySelector('#windows').style.display = 'none';

        if (global.notes.length == 1) window.location = '/';
    });

    // -----------------------------

    // Cancle Button: .btnCancle
    document.querySelectorAll('.btnCancle').forEach(element => element.addEventListener('click', () => {
        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    }))
});