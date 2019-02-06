
const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

//
var mainWindow = null

//
app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 600, height:400})
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    //mainWindow.webContents.openDevTools()
    
    mainWindow.on('closed', () => { mainWindow = null })
})

//
app.on('window-all-closed', () => { app.quit() })


//
const mainMenuTempl = [
    {
        label: 'Ծրագիր',
        submenu: [
            {
                label: 'Ընտրել ֆայլ...',
                click() { mainWindow.webContents.send('read-data-file') }
            },
            {
                label: 'Նոր անձ...',
                click() { mainWindow.webContents.send('add-new-user-by-url') }
            },
            {
                type: 'separator'
            },
            {
                label: 'Ելք',
                click() { app.quit() }
            }
        ]
    },
    {
        label: 'Յուշում',
        submenu: [
            {
                label: 'Տեղեկութիւն',
                click() { mainWindow.webContents.send('show-info') }
            }
        ]
    }
]

//
const mainMenu = Menu.buildFromTemplate(mainMenuTempl)
Menu.setApplicationMenu(mainMenu)

