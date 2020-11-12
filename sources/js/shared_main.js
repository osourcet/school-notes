document.addEventListener('DOMContentLoaded', async () => {
    let urlParams = new URLSearchParams(window.location.search);

    let req = await fetch('/api/note/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: urlParams.get('id')})
    });

    let data = await req.json();
    global.notes.push(Note.toNote(data.note));

    updateNoteArea('#notes', global.notes, global.settings);
});