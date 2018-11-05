// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut} = require('electron')
const childProcess = require('child_process').execFile;
const {PythonShell} = require('python-shell')
const path = require('path');

var unity;
var filePath = null;
var pyshell = null;

var io = require('socket.io')();
io.on('connection', function(socket){
  unity = socket;

  console.log("unity connected");

  socket.on('disconnect', function(){
    console.log('unity disconnected');
  });

  socket.on("EndRotation", function() {
    pyshell.send('continue');
  });
});
io.listen(3000);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const menu = new Menu()

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 50,
    height: 50,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // mainWindow.maximize()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  menu.append(new MenuItem({
    label: "Open File",
    accelerator: 'Ctrl+O',
    click: () => {
      mainWindow.webContents.send('openFile')
    }
  }))

  menu.append(new MenuItem({
    label: "Save File",
    accelerator: 'Ctrl+S',
    click: () => {
      if(filePath) {
        console.log("Save file: " + filePath);
        mainWindow.webContents.send('saveFile')
      }
    }
  }))

  menu.append(new MenuItem({
    label: "Launch Simulator",
    accelerator: 'Ctrl+L',
    click: () => {
      console.log("Launch Simulator");
      childProcess("game/RobotSimulator.exe", function(err, data) {
        if(err){
           console.error(err);
           return;
        }
      });
    }
  }))

  Menu.setApplicationMenu(menu)

  const ret = globalShortcut.register('Ctrl+Alt+E', () => {
    mainWindow.webContents.send('toggleEditor')
  })
}

ipcMain.on('openFile', (event, path) => {
  console.log("File opened: " + path);
  filePath = path;
})

ipcMain.on('launchSimulator', (event) => {
  console.log("Launch Simulator");
  let p = path.join(__dirname, '..\\game\\RobotSimulator.exe');
  childProcess(p, function(err, data) {
    if(err){
       console.error(err);
       mainWindow.webContents.send("launchError" , p);
       return;
    }
  });
})

ipcMain.on('executeScript', (event) => {
  console.log("--Execute Script--")

  pyshell = new PythonShell(filePath)
  pyshell.on('message', function (message) {
    let lol = message.split(" ");
    if(lol[0] != 'wait') {
      let values = message.split(" ");
      // received a message sent from the Python script (a simple "print" statement)

      let type = values[0];
      values.shift()

      let data = null;


      if(type == "message") {
        data = {message: values.join(" ")};
      } else if(values.length == 3) {
        data = {x: values[0], y: values[1], z: values[2]}
      } else if(values.length == 2) {
        data = {x: values[0], y: values[1]}
      } else {
        data = {x: values[0]}
      }
      console.log(type + " send to unity --- ");
      console.log(values);

      if(unity) {
        unity.emit(type, data)
      }
    } else {
      console.log("---- WAIT ----");
      var data = message.split(" ");
      setTimeout(function() {
        pyshell.send('continue');
        console.log("-- CONTINUE --");
      }, data[1] * 1000);
    }
  });
})

ipcMain.on('restartLevel', (event) => {
  console.log("--Restart Level--");
  if(unity) {
    unity.emit('RestartLevel')
  }
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
