
const electron = require('electron')
const fs = require('fs')

const otplib = require('otplib')

const ipc = electron.ipcRenderer
const dialog = electron.remote.dialog

// ░░ ██
const delayBar = '███████████████'
//const delayBar = '░░░░░░░░░░░░░░░'

//
var allUsers = null

//
var formatedOTP = function(secret) {
    let code = otplib.authenticator.generate(secret)
    return code = code.slice(0, 2) + ' ' + code.slice(2, 4) + ' ' + code.slice(4)
}

//
var readUserDataAndCreateTable = function() {
    // ընտրել ֆայլը
    var ufpath = dialog.showOpenDialog({
        defaultPath: __dirname,
        properties: ['openFile'] })

    // կարդալ ֆայլի պարունակությունը
   let data = fs.readFileSync(ufpath[0], 'utf8')
   allUsers = JSON.parse(data)

    // աղյուսակի տողի կաղապարը
    let oneuser = document.getElementById('one-user')
    // աղյուսակի մարմինը
    let userlist = document.getElementById('user-list')
    while (userlist.lastChild)
        userlist.removeChild(userlist.lastChild)

    for(let ui in allUsers) {
        let nam = allUsers[ui].name.toLowerCase()
        let sec = allUsers[ui].secret

        let nu = oneuser.content.cloneNode(true)
        let chs = nu.firstElementChild.children
        chs[0].id = 'name-' + nam
        chs[0].innerText = allUsers[ui].name
        chs[1].id = 'secret-' + nam
        chs[1].innerText = sec
        chs[2].id = 'pass-' + nam
        chs[2].innerText = formatedOTP(sec)
        chs[3].id = 'timer-' + nam

        allUsers[ui].otpElem = chs[2]
        allUsers[ui].timerElem = chs[3]

        allUsers[ui].updateCode = function() {
            let seconds = Math.floor(Date.now() / 1000);
            let delay = seconds % 30
            
            if(1 > delay)
                this.otpElem.innerText = formatedOTP(this.secret)

            //this.timerElem.innerText = 30 - delay
            this.timerElem.innerText = delayBar.slice(0, (30 - delay) / 2)
        }

        userlist.appendChild(nu)
    }
}

//
ipc.on('read-data-file', readUserDataAndCreateTable)

//
ipc.on('add-new-user-by-url', () => {
    let newUser = document.getElementById('add-new-user')
    document.getElementById('anu-ok').onclick = function() { newUser.close() }
    newUser.show() 
})

//
ipc.on('show-info', () => {
    let infoBox = document.getElementById('show-information')
    document.getElementById('si-ok').onclick = function() { infoBox.close() }
    infoBox.show() 
})

//
setInterval(() => {
    if( allUsers != null )
        for(let ui of allUsers)
            ui.updateCode()
}, 1000)
