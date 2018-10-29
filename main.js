// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const {PythonShell} = require('python-shell')

var unity;

var io = require('socket.io')();
io.on('connection', function(socket){
  unity = socket;

  console.log("unity connected");

  socket.on('disconnect', function(){
    console.log('unity disconnected');
  });
});
io.listen(3000);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.maximize()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipcMain.on('executeScript', (event) => {
  // secondWindow.webContents.send('createTables', data)
  console.log("--Execute Script--")

  let pyshell = new PythonShell('test.py')
  pyshell.on('message', function (message) {
    values = message.split(" ");
    // received a message sent from the Python script (a simple "print" statement)

    let type = values[0];
    values.shift()

    let data = {message: values.join(" ")};

    if(unity) {
      unity.emit(type, data)
      console.log(type + " send to unity");
    }
  });

})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
