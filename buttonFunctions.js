//will import a file as a json string
function importJson() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  } else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    lines = e.target.result;
    var newArr = JSON.parse(lines);
  }

}

//TODO export current global json as a file
function exportJson() {

}

//TODO change the element in a json to another format
function editJsonElement(key, path) {
  console.log("edit json element: " + key + " at " + path);
}

//TODO duplicate the element in a json
function duplicateJsonElement(key, path) {
  newName = key;
  while (global.currentJson.hasOwnProperty(newName)) {
    newName = newName + "_dup";
  }

  global.currentJson[newName] = global.currentJson[key];
  global.globalJsonData = saveCurrentNode(global.currentPath, global.globalJsonData, global.currentJson);
  changePath(global.currentPath);
}

//TODO deletes the element from json
function deleteJsonElement(key, path) {
  delete global.currentJson[key];
  global.globalJsonData = saveCurrentNode(global.currentPath, global.globalJsonData, global.currentJson);

  //console.log(global.globalJsonData);
  changePath(global.currentPath);
}
