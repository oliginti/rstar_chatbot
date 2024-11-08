'use strict';

if (typeof clientAuthEnabled === 'undefined') {
    var clientAuthEnabled = false;
}

/**
 * Chat Widget configuration settings
 * Depending on the type of channel connecting to, the mandatory requirements
 * in the settings object are different.
 *
 * If the channel has client authentication enabled, the settings must pass
 * clientAuthEnabled: true
 *
 * If the channel has client authentication disabled, the settings should pass
 * channelId, and optionally, userId.
 */
var chatWidgetSettings;
if (clientAuthEnabled) {
    chatWidgetSettings = {
        URI: '<url>',
        clientAuthEnabled: true
    };
} else {
    // URI and channelId values are needed to run this sample. Icons are optional.
    // TODO: COnfigure Channel id and URL from environment properties

}


/**
 * Below functions are used for selecting the Menu Items 
 * Note: Function will increase if we create more menu items
 */
function powerLine() {
    Bots.sendMessage('Ask Delmarva Power Downed Power Line');
    hide();
}

function outage() {
    Bots.sendMessage('Ask Delmarva Power Outage');
    hide();
}

function billing() {
    Bots.sendMessage('Ask Delmarva Power Billing and Payment');
    hide();
}

function accountNumber() {
    Bots.sendMessage('Ask Delmarva Power Find Account Number');
    hide();
}

function startStop() {
    Bots.sendMessage('Ask Delmarva Power Start, Stop or Move Service');
    hide();
}

function recycling() {
    Bots.sendMessage('Ask Delmarva Power Recycling, Appliances, and Ways to Save');
    hide();
}

function more() {
    Bots.sendMessage('Ask Delmarva Power More');
    hide();
}

function coronavirusmenu() {
    Bots.sendMessage('Ask Delmarva Power Covid-19 Assitance');
    hide();
}

function showMenu(){
    var element = document.getElementById("menu-items");
    element.classList.remove("hide");
    element.classList.add("menu-icon")
}

function hide(){
    var element = document.getElementById("menu-items");
     element.classList.remove("menu-icon");
     element.classList.add("hide");
}



/**
 * Function for showing the Menu Items
 */
function menuItems() {
    
    let k = document.getElementById("menu-items").style.display = "block";
    showMenu();
}

/**
 * Function for removing the menu items on mouse out
 */
function menuMouseOut() {
    let k = document.getElementById("menu-items");
    k.style.display = "none"
}

/**
 *   Main initial function for calling the bots SDK and initializing the Chat button page
 *   Parameter Required: chatWidgetSettings -> contains all the required paramater required for Bots 
 */
function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};
var timer = null;
var hiddenFlag;
function showChatButton(opco) {
    /**
     * Initialize the SDK and set a name for it which will be used to
     * refer it, and call its APIs.
     */

    var channelId;
    switch (opco) {
        case 'pepco':
            channelId = "7b065762-2c8a-4289-a093-cdec6cf2b003";
            break;
        case 'dpl':
            channelId = "ee4418d3-c4b3-4368-b60d-461466e5eaff";
            break;
        case 'ace':
            channelId = "e7bee7cd-6e35-4452-b9a6-8ace54b1d7dd"
            break;
        default:
            console.log("Channel ID Not Found");
    }
    console.log("OPCP:" + opco + "channel id" + channelId)

    chatWidgetSettings = {
        URI: 'sofbangtempoda-sofbangucc.botmxp.ocp.oraclecloud.com',  // ODA URI, only the hostname part should be passed, without the https   //
        clientAuthEnabled: false,                                                                   // Enables client auth enabled mode of connection if set true
        channelId: "76ccd3ac-e47b-4154-b032-1216e5287612",                                          // Channel ID, available in channel settings in ODA UI
        userId: randomIntInc(1000000, 9999999).toString(),                                                                         // User ID, optional field to personalize user experience
        // customHeaderElementId: 'customMenu',
        enableAutocomplete: true,                                                                   // Enables autocomplete suggestions on user input
        displayStyle: 'button',
        botIcon: 'https://rstartec.com/wp-content/uploads/2024/08/chatbot-icon-1.png',                                                                //for the Bot icon
        botButtonIcon: 'https://rstartec.com/wp-content/uploads/2024/08/chat-launch.svg',
        enableBotAudioResponse: false,                                                              // Enables audio utterance of skill responses
        enableClearMessage: false,                                                                  // Enables display of button to clear conversation
        enableTimestamp: false,                                                                     // Show timestamp with each message
        showConnectionStatus: false,                                                                // Displays current connection status on the header
        openChatOnLoad: false,
        enableAttachment: false,
        enableHeadless: false,
        showTypingIndicator: true,
        initUserProfile: {
 
        },
        // initUserHiddenMessage: 'hi',
        disablePastActions: 'none',
        initBotAudioMuted: 'false',
        // readMark: "",
        font: '14px "Open Sans", sans-serif !important',
        i18n: {                                                                                     // Provide translations for the strings used in the widget
            en: {                                                                                   // en locale, can be configured for any locale
                chatTitle: "Let's Chat!",                                                           // Set title at chat header
                connected: 'Ready',                                                                 // Replaces Connected
                inputPlaceholder: 'Type a message....',                                             // Replaces Type a message
                send: 'Send'
            }

        }
    };

    initSdk('Bots')
    function initSdk(name) {
        
        // Default name is Bots
        if (!name) {
            name = 'Bots';
        }
        setTimeout(() => {
            let Bots;
            if (clientAuthEnabled) {
                Bots = new WebSDK(chatWidgetSettings, generateToken);
            } else {
                Bots = new WebSDK(chatWidgetSettings);
                customUI()
                
            }
            
            /**
             * Function for adding hover element
             */
            var chatButton = document.getElementsByClassName('oda-chat-button-icon');

            chatButton[0].addEventListener("mouseover", mouseOver);
            chatButton[0].addEventListener("mouseout", mouseOut);

            function mouseOver() {
                chatButton[0].src = 'https://rstartec.com/wp-content/uploads/2024/08/chat-launch.svg'
            }
            function mouseOut() {
                chatButton[0].src = 'https://rstartec.com/wp-content/uploads/2024/08/chat-launch.svg'
            }

            hiddenFlag = true

            /** 
             * Function for sending the hidden Hi message
             * 
             */
            Bots.connect().then(() => {
                Bots.setDelegate({
                    beforeDisplay(message) {
                        resetTimer();
                        console.log("before display in connect", message.channelExtensions)
                        if (message.channelExtensions) {
                            if (message.channelExtensions.endLastState) {
                                //ONLY RESPONSES WITH A LAST STATE PROPERTY SET THE TIMER
                                setTimer(message.channelExtensions.endLastState,
                                    message.channelExtensions.botId
                                    , message.channelExtensions.goToState);
                            }
                        }
                        return message;
                    }
                });
            });
            
            /** For sending the hi high message on hidden
             * 
             */
            Bots.on('widget:opened', openWidgetBotConnect);
           
            /** Handle Message for sending the timer value
             * 
            */
             Bots.on('message',setTimerFunctionForSessionOut);

            
            window[name] = Bots;
        });
    }
}

function openWidgetBotConnect() {
    if(hiddenFlag){
        console.log("Inside the if condition");
        Bots.sendMessage('hi', { hidden: true })
    }else{
        console.log("Inside the else condition")
    }
    
}



function setTimerFunctionForSessionOut() {
    Bots.setDelegate({
        beforeSend(message) {
            //ANY RESPONSE Remove the opco name
            if (message.text.includes('Ask Delmarva Power')) {
                var displayText = message.text.replace('Ask Delmarva Power', '');
                message.text = displayText;
                return message;
            }
            return message
        },
        beforeDisplay(message) {
                resetTimer();
                console.log("before display",message.channelExtensions)
                if (message.channelExtensions) {
                    if (message.channelExtensions.endLastState) {
                        //ONLY RESPONSES WITH A LAST STATE PROPERTY SET THE TIMER
                        setTimer(message.channelExtensions.endLastState,
                            message.channelExtensions.botId
                            , message.channelExtensions.goToState);
                    }
                }
                return message;
            
        }
    })
}

function resetTimer(){            
    if(timer != null){                
        clearTimeout(timer);
    }
    return;
}

function setTimer(lastState, botId, goToState) {
    var _lastState = lastState;
    var _botId = botId;
    var _goToState = goToState;
    console.log("LastState...." + _lastState + "..BotID..." + _botId + "...GotoState..." + _goToState);
    timer = setTimeout(() => {
        console.log("Set time out")
        Bots.sendMessage({
            "postback": {
                "variables": { "endLastState": _lastState },
                "system.botId": _botId,
                "action": "",
                "system.state": _goToState
            },
            "text": "Maximum user idle time reached",
            "type": "postback"
        });
    },
        10 * 1000
    );
}





/**
 * Function for minimizing the chat window in the current state
 * 
 */
function minimize() {
    hiddenFlag = false
    Bots.closeChat();
}


/**
 * Close function is used for opening up the modal for providing the multiple opition
 * 
 */
function Close() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

}


/** 
 * Function for clearing the chat window and restarting the chat server 
 * 
*/
function CloseYes() {
    if(timer != null){      
        console.log("Timer function");          
        clearTimeout(timer);
    }
    
    closeWidgetSessionClear();
    Bots.closeChat();
};

function closeWidgetSessionClear(){
   let sendMessageValue = Bots.sendMessage('End');
   if(sendMessageValue){
    closeWidgetDestroyFunction();
   }
}


function closeWidgetDestroyFunction(){
    Bots.destroy();
    showChatButton('dpl');
}

function openChat(){
    Bots.openChat();
 }

/** Function for stopping the modal display 
 * 
 */
function CloseNo() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

function downloadPDF(billImagePdfData) {
    try {
        console.log("Data" + JSON.stringify(billImagePdfData));
        var linkSource = "data:application/pdf;base64," + billImagePdfData;
        var fileName = "BillImage.pdf";
        let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
            !window.MSStream;
        if (isIOS) {
            openTab(linkSource);
        } else if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            var byteCharacters = window.atob(content.data.billImageData);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'application/pdf' });
            //window.navigator.msSaveOrOpenBlob(blob, fileName); 
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            var downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }

    } catch (error) {
       console.log("Server not responding")     
    }
}

/** Function For creating Menu Options and Close and minimize icon in the Header Section
 * 
 */
function customUI() {
    var element = document.getElementsByClassName('oda-chat-header-actions');

    element[0].insertAdjacentHTML("beforeBegin", "\n<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.css' type='text/css'></link>\n")
   
 
    /** Close and Minimize function
     * 
     */
    element[0].insertAdjacentHTML("beforeBegin", `<div id='min' class='close-handle close-hidden' style='text-align:right'>
    <a href='javascript:window.parent.minimize();'><i class='fa fa-minus' style='color:#0059A4'></i></a>&emsp;
    <a href='javascript:window.parent.Close();'><i class='fa fa-times' style='color:#0059A4'></i></a>
    </div>`)

    /**Modal on clicking the close button
     * 
     */

    element[0].insertAdjacentHTML("beforebegin", `<div id='myModal' class='modal'>
    <div class='modal-content'>
        <p style='text-align:center;margin-bottom: 2%;'>Do you want to end the conversation?</p>
        <p style='text-align:center;margin-top: 0%;margin-bottom: 0%;'>This will clear your chat history.</p><button
            type='button' onclick='javascript:window.parent.CloseNo();' id='noButton'>No</button><button
            type='button' onclick='javascript:window.parent.CloseYes();' id='yesButton'>Yes</button>
    </div>
   </div>`)


}



