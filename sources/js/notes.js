
class Note{
    constructor(title, subject, date, important, checked, content, id){
        this.id = (id) ? id : undefined;
        this.title = title;
        this.subject = subject;
        this.date = date;
        this.important = important;
        this.checked = checked;
        this.content = content;
    }

    /**
     * creates and returns html code of this Note object
     */
    get html(){
        return `
        <div id="${this.id}" class="${(this.checked) ? 'bg-success text-white' : (this.important) ? 'bg-warning' : 'bg-light'} bg-gradient p-4 box rounded m-3 col-1" >
    
            <!-- title -->
            <div class="mb-3 d-flex justify-content-between align-items-center">
                <h4 class="pt-1">${this.title}</h4>
                <button type="button" class="btn p-1 btnEdit" style="height: auto !important;">   
                    <svg width="25" height="25" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="${(this.checked) ? 'white' : 'currentColor'}" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                </button>
            </div>
            <!-- subject -->
            <div class="mb-3">
                Fach: ${this.subject}
            </div>
            <!-- date -->
            <div class="mb-4">
                Zu erledigen bis: ${moment(this.date, 'YYYY-MM-DD').format(global.settings.dateFormat)}
            </div>
            <!-- notes -->
            <div class="">
                <div class="p-1 mb-2 plain" style="display: none;">
                    ${this.content}
                </div>
                <div class="p-1 markdown" id="content">
                    ${(this.content == '') ? '' : markdownToHtml(this.content)}
                </div>
            </div>
        </div>
        `;
    }

    /**
     * convert a Note object (this) to an object
     * @returns {object} converted Note object
     */
    toObject(){
        return {
            id: this.id,
            title: this.title,
            subject: this.subject,
            date: this.date,
            important: this.important,
            checked: this.checked,
            content: this.content
        }
    }

    /**
     * converts an object to a Note object
     * @param {object} obj an object which should be converted to a Note object
     * @returns a Note object
     */
    static toNote(obj){
        return new Note(
            obj.title,
            obj.subject,
            obj.date,
            obj.important,
            obj.checked,
            obj.content,
            obj.id
        )
    }
}

/**
 * @param {String} name name of cookie
 * @returns {Note[]} array of Note objects created by JSON from the cookie
 */
function getNotesFromCookies(name){
    let getJson = JSON.parse(getCookie(name).value);
    let get = []
    getJson.notes.forEach(note => get.push(Note.toNote(note)));
    return get;
}

/**
 * Coverts an array of Notes objects to an array of objects and save that array in a cookie
 * @param {String} name name of the cookie
 * @param {Note[]} notes Array of Note objects
 */
function saveNotesInCookies(name, notes) {
    let toSave = [];
    notes.forEach(note => toSave.push(note.toObject()));

    setCookie(name, JSON.stringify({notes: toSave}))
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