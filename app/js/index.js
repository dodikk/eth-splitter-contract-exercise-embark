import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import AdkSplitterForTwo from 'Embark/contracts/AdkSplitterForTwo';
const $ = require('jquery');


var _accounts = null;

var _sender         = null;
var _firstReceiver  = null;
var _secondReceiver = null;

var _splitterInstanceAddress = null;



$(document).ready(
async function ()
{
     console.log("=== [BEGIN] document.ready");

     await loadAccountsAsync();
     subscribeToContractEventsAsync();


     $("#splitter_button button").click(
     async function ()
     {
         console.log("=== [BEGIN] button clicked");


         try
         {
             console.log("=== [BEGIN] split ether transaction");


            var splitTransactionReceipt = 
             await AdkSplitterForTwo.methods
             .Split(
                 _firstReceiver , 
                 _secondReceiver) 
             .send(
             {
                 from    : _sender, 
                 value   :    2000, 
                 gasPrice:      '0' 
             });

             console.log("=== [END] split ether transaction");
         }
         catch (ex)
         {
              console.log("Error splitting ether : ");
              console.log(ex);
         }

         renderState();


         console.log("=== [END] button clicked");
     })

    console.log("=== [END] document.ready");

}) // func document.ready()


function subscribeToContractEventsAsync()
{

//    AdkSplitterForTwo.events.LogEndSplit(function (error, events) {} )
//     AdkSplitterForTwo.events.allEvents(function (error, events) {} )

    // Other subscription methods do not seem to work
    // they are commented above
    //
    web3.eth.subscribe('logs',
    {
        address: _splitterInstanceAddress
    },
    function (event, error)
    {
    })
    .on('data',
    function (event)
    {
        console.log(`=== [EVENT] LogEndSplit | event : ${event} |`);
        renderState();
    })
    .on('error',
    function (error)
    {
        console.log(`=== [EVENT] LogEndSplit | error : ${error} |`);
        renderState();
    });

}


async function renderState()
{
    console.log("=== [BEGIN] renderState()");

    var senderBalance         = await web3.eth.getBalance(_sender                 );
    var firstStrangerBalance  = await web3.eth.getBalance(_firstReceiver          );
    var secondStrangerBalance = await web3.eth.getBalance(_secondReceiver         );
    var contractBalance       = await web3.eth.getBalance(_splitterInstanceAddress);


    var strSenderAddress = _sender;
    var strSenderBalanceEth = web3.utils.fromWei(senderBalance);


    $("#row_sender .col_address"    ).html(strSenderAddress   );
    $("#row_sender .col_balance_wei").html(senderBalance      );
    $("#row_sender .col_balance_eth").html(strSenderBalanceEth);


    // =====
    //
    var strFirstReceiverAddress = _firstReceiver;
    var strFirstReceiverBalanceEth = web3.utils.fromWei(firstStrangerBalance);

    $("#row_recv_1 .col_address"    ).text(strFirstReceiverAddress   );
    $("#row_recv_1 .col_balance_wei").text(firstStrangerBalance      );
    $("#row_recv_1 .col_balance_eth").text(strFirstReceiverBalanceEth);


    // =====
    //
    var strSecondReceiverAddress = _secondReceiver;
    var strSecondReceiverBalanceEth = web3.utils.fromWei(secondStrangerBalance);

    $("#row_recv_2 .col_address"    ).text(strSecondReceiverAddress   );
    $("#row_recv_2 .col_balance_wei").text(secondStrangerBalance      );
    $("#row_recv_2 .col_balance_eth").text(strSecondReceiverBalanceEth);



    // =====
    //
    var strContractAddress = _splitterInstanceAddress;
    var strContractBalanceEth = web3.utils.fromWei(contractBalance);

    $("#row_contract .col_address"    ).text(strContractAddress   );
    $("#row_contract .col_balance_wei").text(contractBalance      );
    $("#row_contract .col_balance_eth").text(strContractBalanceEth);


    console.log(`|Sender         | ${strSenderAddress} | ${senderBalance} wei | ${strSenderBalanceEth} ether |` );
    console.log(`|First receiver | ${strFirstReceiverAddress} | ${firstStrangerBalance} wei | ${strFirstReceiverBalanceEth} ether |` );
    console.log(`|Second receiver| ${strSecondReceiverAddress} | ${secondStrangerBalance} wei | ${strSecondReceiverBalanceEth} ether |` );
    console.log(`|Contract       | ${strContractAddress} | ${contractBalance} wei | ${strContractBalanceEth} ether |` );


    console.log("=== [END] renderState()");
}


async function loadAccountsAsync()
{
    console.log("=== [BEGIN] loadAccountsAsync");

    var strGlobalContract = JSON.stringify(AdkSplitterForTwo);
    var globalContractType = typeof AdkSplitterForTwo;

    console.log(`Global contract : ${strGlobalContract}`);
    console.log(`Global contract type: ${globalContractType}`);

    console.log("=== [BEGIN] eth.getAccounts()");
    _accounts = await web3.eth.getAccounts();
    console.log("=== [END] eth.getAccounts()");


    var accountsType = typeof _accounts;
    console.log(`accounts : ${_accounts}`);
    console.log(`accounts type : ${accountsType}`);


    console.log("=== [BEGIN] get contract address");
    _splitterInstanceAddress = 
        await AdkSplitterForTwo.methods
                               .GetContractAddress()
                               .call(
                                   {
                                       from    : _accounts[0],
                                       gasPrice: '0'
                                   });
    console.log("=== [END] get contract address");





    // TODO: add more addresses in the config
    //
    _sender         = _accounts[0];
    _firstReceiver  = _accounts[1];
    _secondReceiver = _accounts[2];


     console.log(`_sender                  : ${_sender}`                 );
     console.log(`_firstReceiver           : ${_firstReceiver}`          );
     console.log(`_secondReceiver          : ${_secondReceiver}`         );
     console.log(`_splitterInstanceAddress : ${_splitterInstanceAddress}`);


    await renderState();

    console.log("=== [END] loadAccountsAsync");
}

