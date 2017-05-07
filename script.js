//-------------------GLOBALS--------------------------
var $ = jQuery;

global = {
    currentJson: {},
    globalJsonData: {
        "name": "ivo",
        "surname": "barros"
    },
    currentPath: ""
}

function refreshFormTab(jsonData) {
    //generate new form window
    $('#formOutput').html("");
    $('#formOutput').append(
        jsonToForm(jsonData)
    );
}

function refreshJsonTab(jsonData) {
    //generate new json window
    $('#jsonSrouce-TextArea').val(JSON.stringify(jsonData, null, 2));
}

//Changes current path to new path and updates path div
function changePath(newPath) {
    if (newPath == "" || newPath == "/") {
        global.currentPath = "";
        global.currentJson = global.globalJsonData;
        $('#currentParent').hide();
    } else {
        global.currentPath = newPath;
        $('#currentParent').show();
        folderTree = global.currentPath.split('/');

        tempJson = global.globalJsonData;
        for (var i = 1; i < folderTree.length; i++) {
            tempJson = tempJson[folderTree[i]];
        }
        global.currentJson = tempJson;
    }
    $('#currentPath').text(global.currentPath);
    refreshFormTab(global.currentJson);
    refreshJsonTab(global.currentJson);
}

function gotoParent() {
    split = global.currentPath.split('/');
    var newPath = split.slice(0, split.length - 1).join("/");
    changePath(newPath);
}

//http:/ / api.duckduckgo.com / ? q = BlackBerry & format = json & pretty = 1
function downloadJson() {
    if ($("#downloadPath")[0].value) {
        $.ajax({
            url: $("#downloadPath")[0].value,
            dataType: "jsonp",
            success: function(data) {
                global.globalJsonData = data;
                changePath("/");
            }
        });
    }
}

/*
creates form elements from json
returns a Form Element
*/
function jsonToForm(jsonData) {
    var newForm = $('<div></div>')
    for (var i in jsonData) {
        var key = i;
        var val = jsonData[i];

        var fatherElement = $('<div class="form-group fatherJson"></div>');

        switch (typeof(val)) {
            case 'boolean':
                fatherElement.addClass('checkForm');
                fatherElement.append(
                    $('<div class="checkbox"></div>').append(
                        $('<label class="jsonKey"><input class="jsonValue" type="checkbox" ' + (val ? 'checked' : '') + ' value="">' + key + '</label>')
                    )
                );
                break;

            case 'object':
                fatherElement.addClass('objectForm');
                fatherElement.append(
                    $('<button type="button" class="btn btn-default" onClick="changePath(\'' + global.currentPath + '/' + key + '\')" >' + key + '</button>')
                );
                break;


            default:
                fatherElement.addClass('textForm');
                fatherElement.append(
                    $('<label for="example-text-input" class="col-2 col-form-label jsonKey">' + key + '</label>')
                );
                fatherElement.append(
                    $('<div class="col-10"></div>').append(
                        $('<input class="form-control jsonValue" type="text" value="' + val + '">')
                    )

                );
                break;
        }


        //add extra buttons to each element
        fatherElement.append(
            $(`
            <div class="action-btns">
            <button type="button" class="btn btn-primary" onClick="editJsonElement('` + key + `','` + global.currentPath + `')" >edit</button>
             <button type="button" class="btn btn-success" onClick="duplicateJsonElement('` + key + `','` + global.currentPath + `')">duplicate</button>
            <button type="button" class="btn btn-danger" onClick="deleteJsonElement('` + key + `','` + global.currentPath + `')">delete</button>
            </div>
            `)
        );


        $(newForm).append(fatherElement);
    }
    return newForm;
}


//update a jsonNode
function updateJson(jsonKey, jsonValue) {
    //save on current node
    if (jsonKey == "") return

    if (global.currentJson[jsonKey] != jsonValue) {
        global.currentJson[jsonKey] = jsonValue;
    }

    global.globalJsonData = saveCurrentNode(global.currentPath, global.globalJsonData, global.currentJson);
}

function saveCurrentNode(path, jsonData, jsonNodeData) {
    if (path == '' || path == "/") {
        return jsonNodeData;
    } else {
        //first find out how big the current path is
        allPathFolders = path.split('/');
        tempJson = jsonData;
        for (var i = 1; i < allPathFolders.length - 1; i++) {
            tempJson = tempJson[allPathFolders[i]];
        }
        parentJson = tempJson;

        parentJson[allPathFolders[allPathFolders.length - 1]] = jsonNodeData;

        folderTree = allPathFolders.slice(0, allPathFolders.length - 1).join("/")
        return saveCurrentNode(folderTree, jsonData, parentJson);
    }
}

//-------------------EVENTS--------------------------

//when text inputed into jsontextarea
$('#jsonSrouce-TextArea').keyup(function() {
    var jsonText = $('#jsonSrouce-TextArea').val();

    if (tryParseJSON(jsonText)) {
        $("#jsonError").text("");
        var jsonObject = JSON.parse(jsonText);
        global.currentJson = jsonObject;
        global.globalJsonData = saveCurrentNode(global.currentPath, global.globalJsonData, global.currentJson);
    } else {
        $("#jsonError").text("Not Valid");
        $('#formOutput').text("");
    }
});


//when form changes, update json to reflect
$('#formOutput').on('keyup click', function(e) {
    var fatherElement = $(e.target).closest('.fatherJson');
    var jsonKey = "";
    var jsonValue = "";

    if (fatherElement.hasClass('textForm')) {
        jsonKey = fatherElement.find('.jsonKey').text();
        jsonValue = fatherElement.find('.jsonValue').val();
    }

    if (fatherElement.hasClass('checkForm')) {
        jsonKey = fatherElement.find('.jsonKey').text();
        jsonValue = fatherElement.find('.jsonValue').is(':checked');
    }

    updateJson(jsonKey, jsonValue);
});

$('.nav-tabs').on('click', function(e) {
    changePath(global.currentPath);
});

changePath("/");
