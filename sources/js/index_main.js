// main function
document.addEventListener('DOMContentLoaded', () => {

        // #buttons > *
    let buttons = document.querySelector('#buttons'),
        // #create-note > *
        window_NoteCreate = document.querySelector('#note-create'),
        // #delete-notes > *
        window_NotesDelete = document.querySelector('#notes-delete'),
        // #settings > *
        window_Settings = document.querySelector('#settings'),
        // #filter-sorting > *
        window_Filter_Sorting = document.querySelector('#filter-sorting'),
        // #note-menu > *
        window_NoteMenu = document.querySelector('#note-menu'),
        // #note-edit > *
        window_NoteEdit = document.querySelector('#note-edit'),
        // #note-share > *
        window_NoteShare = document.querySelector('#note-share');

    // +------------------+
    // |  event listener  |
    // +------------------+

    // reload event listener
    document.addEventListener('reload', () => {
        checkAlerts();

        if(getCookie('school-notes').key != null){
            global.notes = [];
            getCookie('school-notes', true).value.notes.forEach(note => global.notes.push(Note.toNote(note)));
        }

        updateNoteArea('#notes', global.notes, global.settings);

        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));
    })

    // -----------------------------

    // #buttons > *

    // sync button
    buttons.querySelector(':scope > #btnSync').addEventListener('click', () => {});

    // settings button
    buttons.querySelector(':scope > #btnSettings').addEventListener('click', () => {
        showWindowsChild(window_Settings);
    });

    // add note button
    buttons.querySelector(':scope > #btnAddNote').addEventListener('click', () => {
        showWindowsChild(window_NoteCreate);
    });

    // delete notes button
    buttons.querySelector(':scope > #btnClearCookies').addEventListener('click', () => {
        showWindowsChild(window_NotesDelete);
    });

    // search button
    buttons.querySelector(':scope > #btnSearch').addEventListener('click', () => {});

    // filter button
    buttons.querySelector(':scope > #btnFilter').addEventListener('click', () => {
        showWindowsChild(window_Filter_Sorting);
    });

    // -----------------------------

    // #create-note > *

    window_NoteCreate.querySelector(':scope #btnCreateNote').addEventListener('click', () => {
        // Creates a new Note object and pushes it to the notes array
        global.notes.push(new Note(
            window_NoteCreate.querySelector(':scope #title').value,
            window_NoteCreate.querySelector(':scope #subject').value,
            window_NoteCreate.querySelector(':scope #date').value,
            window_NoteCreate.querySelector(':scope #important').checked,
            false,
            window_NoteCreate.querySelector(':scope #content').value
        ));
        
        // Updates the cookies with the new version of the notes array
        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));

        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    });

    // -----------------------------

    // #delete-notes > *

    window_NotesDelete.querySelector(':scope #btnNotesDelete').addEventListener('click', () => {
        // remove all Note objects from the notes array
        global.notes = [];

        // Updates the cookies with the new version of the notes array
        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));

        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    });

    // -----------------------------

    // #settings > *

    // date format
    window_Settings.querySelector(':scope #dateFormat').value = global.settings.dateFormat;
    window_Settings.querySelector(':scope #dateFormatDisplay').innerHTML = moment('2019-12-24', 'YYYY-MM-DD').format(global.settings.dateFormat);

    // changes date format in settings

    window_Settings.querySelector(':scope #dateFormat').addEventListener('keyup', () => {
        try {
            global.settings.dateFormat = window_Settings.querySelector(':scope #dateFormat').value;
            window_Settings.querySelector(':scope #dateFormatDisplay').innerHTML = moment('2019-12-24', 'YYYY-MM-DD').format(global.settings.dateFormat);
        }
        catch (e) {}
    })

    // download notes as raw json file

    window_Settings.querySelector(':scope #btnDownloadNotes').addEventListener('click', () => {
        downloadCookie('school-notes');
    });

    // -----------------------------

    // #filter-sorting > *

    // changes the sorting settings
    window_Filter_Sorting.querySelector(':scope #sort').addEventListener('change', () => {
        switch (window_Filter_Sorting.querySelector(':scope #sort').value) {
            // sort by date
            // down
            case 'Datum absteigend':
                global.settings.sorting = ['date', -1];
                break;
            
            // up
            case 'Datum aufsteigend':
                global.settings.sorting = ['date', 1];
                break;

            // sort by title
            // down
            case 'Titel absteigend':
                global.settings.sorting = ['title', 1];
                break;
            
            // up
            case 'Titel aufsteigend':
                global.settings.sorting = ['title', -1];
                break;
            
            // sort by subject
            // down    
            case 'Fach absteigend':
                global.settings.sorting = ['subject', 1];
                break;
            
            // up    
            case 'Fach aufsteigend':
                global.settings.sorting = ['subject', -1];
                break;
        }
    });

    // Changes the visibility of important notes
    window_Filter_Sorting.querySelector(':scope #showImportantNotes').addEventListener('change', () => {
        global.settings.visible.important = window_Filter_Sorting.querySelector(':scope #showImportantNotes').checked;
    });

    // Changes the visibility of normal notes
    window_Filter_Sorting.querySelector(':scope #showNormalNotes').addEventListener('change', () => {
        global.settings.visible.normal = window_Filter_Sorting.querySelector(':scope #showNormalNotes').checked;
    });

    // Changes the visibility of checked notes
    window_Filter_Sorting.querySelector(':scope #showCheckedNotes').addEventListener('change', () => {
        global.settings.visible.checked = window_Filter_Sorting.querySelector(':scope #showCheckedNotes').checked;
    });

    // -----------------------------

    // #window_NoteMenu > *

    // btnCheck is pressed
    window_NoteMenu.querySelector('#btnCheck').addEventListener('click', () => {
        global.notes[global.onWorkingId].checked = true;

        // Updates the cookies with the new version of the notes array
        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));

        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    });

    // btnEdit is pressed
    window_NoteMenu.querySelector('#btnEdit').addEventListener('click', () => {
        note = global.notes[global.onWorkingId];

        window_NoteEdit.querySelector(':scope #editTitle').value = note.title;
        window_NoteEdit.querySelector(':scope #editSubject').value = note.subject;
        window_NoteEdit.querySelector(':scope #editDate').value = note.date;
        window_NoteEdit.querySelector(':scope #editImportant').checked = note.important;
        window_NoteEdit.querySelector(':scope #editChecked').checked = note.checked;
        window_NoteEdit.querySelector(':scope #editContent').value = note.content;
        
        document.querySelector('#windows').style.display = 'none';
        showWindowsChild(window_NoteEdit);
    });

    window_NoteMenu.querySelector('#btnShare').addEventListener('click', async () => {

        let note = global.notes[global.onWorkingId].toObject();

        let req = await fetch('/api/note/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({note})
        });

        let data = await req.json();
        window_NoteShare.querySelector('#shared-link').value = `${window.location.href}shared?id=${data.id}`;

        document.querySelector('#windows').style.display = 'none';
        showWindowsChild(window_NoteShare);
    });

    // btnDelete is pressed
    window_NoteMenu.querySelector(':scope #btnDelete').addEventListener('click', () => {
        // Deletes the note with the same id as onWorkingId
        global.notes = global.notes.filter(note => note.id != parseInt(global.onWorkingId));

        // Updates the cookies with the new version of the notes array
        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));
    });

    // -----------------------------

    // #note-edit > *

    window_NoteEdit.querySelector(':scope #btnEditNote').addEventListener('click', () => {
        global.notes[global.onWorkingId] = new Note(
            window_NoteEdit.querySelector(':scope #editTitle').value,
            window_NoteEdit.querySelector(':scope #editSubject').value,
            window_NoteEdit.querySelector(':scope #editDate').value,
            window_NoteEdit.querySelector(':scope #editImportant').checked,
            window_NoteEdit.querySelector(':scope #editChecked').checked,
            window_NoteEdit.querySelector(':scope #editContent').value,
            global.onWorkingId
        );

        // Updates the cookies with the new version of the notes array
        setCookie('school-notes', JSON.stringify({notes: (() => {
            let toReturn = [];
            global.notes.forEach(note => toReturn.push(note.toObject()));
            return toReturn;
        })()}));

        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    });

    // -----------------------------

    // Copy to Clipboard: .btnClipboard

    document.querySelectorAll('.btnClipboard').forEach(element => element.addEventListener('click', () => {
        let target = document.querySelector(`#${document.querySelector('.btnClipboard:focus').dataset.target}`)
        target.select();
        target.setSelectionRange(0, 99999);
        document.execCommand("copy");
        console.log(e);
    }));

    // -----------------------------

    // Cancle Button: .btnCancle
    document.querySelectorAll('.btnCancle').forEach(element => element.addEventListener('click', () => {
        document.querySelector('#windows').style.display = 'none';
        document.dispatchEvent(global.events.reload);
    }));


    document.dispatchEvent(global.events.reload);
});

function checkAlerts(){
    document.querySelector('#alerts').style.display = 'none';
}

/**
 * make a element and the background of #windows visible
 * @param {object} element element which should be visible
 */
function showWindowsChild(element){
    let windows = document.querySelector('#windows');
    windows.style.display = '';
    windows.querySelectorAll(':scope > :not(#background)').forEach(element => element.style.display = 'none');
    element.style.display = '';
}