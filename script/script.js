var playersList;
var config;
var apiData;
var content;
var curPlayerID = -1;
var sidebarContent;

async function loadConf() {
    sidebarContent = document.getElementById("sidebarList").innerHTML;
    content = document.getElementById("content");
    await $.getJSON('config.json', function (data) {
        config = data;
    });
    getList();

    setInterval(function () {
        clearList();
        getList();
    }, 10000);
}

function getList() {
    addLoading();
    fetch(
        config.apiLink + "status"
    ).then(
        rsp => rsp.json()
    ).then(
        data => {
            apiData = data;
            loadList(apiData);
        }
    ).catch(
        e => {
            console.log(e);
            displayError(e);
        }
    )
}

function clearList() {
    document.getElementById("sidebarList").innerHTML = sidebarContent;
}

function loadList(data) {
    var players = data.players;
    playersList = players.list;

    var sidebar = document.getElementById("sidebarList");

    var playerCountBox = document.createElement("div");
    var playerCount = document.createElement("p");  
    playerCount.className = "playerCount";
    playerCount.textContent = `${players.online}/${players.max} Players`;
    playerCountBox.appendChild(playerCount);
    sidebar.appendChild(playerCountBox);

    loadPlayers(playersList, sidebar);
}

function loadPlayers(list, sidebar) {
    var i = 0;
    list.forEach(player => {
        var box = document.createElement("div");
        box.id = "sidebarPlayerBox";
        box.className = "sidebarTab";

        var skinBox = document.createElement("div");

        var skin = document.createElement("img");
        skin.src = "https://visage.surgeplay.com/face/512/" + player.id;
        skin.id = "playerBoxSkin";
        skinBox.appendChild(skin);

        var name = document.createElement("div");
        name.textContent = player.name;
        name.id = "playerBoxName";

        box.appendChild(skinBox);
        box.appendChild(name);

        box.setAttribute("onclick", "switchPlayerData(" + i + ");");

        sidebar.appendChild(box);
        i++;
    });
    removeLoading();
}

function switchPlayerData(id) {
    if (id == curPlayerID)
        return;

    curPlayerID = id;

    addLoading();
    var curPlayerData = playersList[id];
    fetch(
        config.apiLink + 'user?uuid=' + curPlayerData.id
    ).then(
        drsp => drsp.json()
    ).then(
        discord => {
            var contentBox = document.createElement("div");

            var playerName = document.createElement("p");
            playerName.textContent = curPlayerData.name;
            playerName.id = "contentPlayerName";
            contentBox.appendChild(playerName);

            var discordName = document.createElement("p");
            discordName.textContent = discord.name;
            discordName.id = "contentPlayerDiscordName";
            contentBox.appendChild(discordName);

            contentBox.appendChild(getIcons(discord.avatar, "https://visage.surgeplay.com/face/512/" + curPlayerData.id));
            contentBox.appendChild(getIDs(discord, curPlayerData));

            setContent(contentBox);
            removeLoading();
        }
    ).catch(
        e => {
            console.log(e);
            displayError(e);
        }
    );
    console.log("done!");
}

function removeLoading() {
    document.getElementById("loadingOverlay").style.opacity = 0;
    document.getElementById("loadingOverlay").style.width = 0;
    document.getElementById("loadingOverlay").style.height = 0;
}

function addLoading() {
    document.getElementById("loadingOverlay").style.opacity = 1;
    document.getElementById("loadingOverlay").style.width = "110px";
    document.getElementById("loadingOverlay").style.height = "110px";
}

function displayError(e) {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.width = 0;
    sidebar.style.visibility = "hidden";

    var content = document.getElementById("content");
    content.style.backgroundColor = "#202020DD";
    content.style.marginLeft = "0";
    content.style.width = "100%";
    content.style.maxWidth = "100%";
    content.style.visibility = "visible";
    content.style.textAlign = "center";

    var text = document.createElement("p");
    text.innerHTML = "An error occoured!";
    text.style.position = "absolute";
    text.style.top = "50%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.fontSize = "64px";

    var err = document.createElement("p");
    err.innerHTML = e;
    err.style.position = "absolute";
    err.style.bottom = "20px";
    err.style.left = "50%";
    err.style.transform = "translateX(-50%)";

    content.appendChild(text);
    content.appendChild(err);

    removeLoading();
}

function soonDisplay() {
    curPlayerID = -1;
    var contentBox = document.createElement("div");

    var soonText = document.createElement("p");
    soonText.textContent = "soon ;>";
    soonText.id = "soonText";
    contentBox.appendChild(soonText);

    setContent(contentBox);
}

//load stuff into the actual content div
function setContent(newContent) {
    content.innerHTML = newContent.innerHTML;
}