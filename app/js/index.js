import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import AdkSplitterForTwo from 'Embark/contracts/AdkSplitterForTwo';
// import $ './jquery';
var $ = require('jquery');


var _accounts = null;

var _sender         = null;
var _firstReceiver  = null;
var _secondReceiver = null;

var _splitterInstanceAddress = null;



$(document).ready(
async function ()
{
     await loadAccountsAsync();

     $("#splitter.button button").click(
     async function ()
     {

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


         renderState();
     })
}) // func document.ready()


async function renderState()
{
    var senderBalance         = await web3.eth.getBalance(_sender                 );
    var firstStrangerBalance  = await web3.eth.getBalance(_firstReceiver          );
    var secondStrangerBalance = await web3.eth.getBalance(_secondReceiver         );
    var contractBalance       = await web3.eth.getBalance(_splitterInstanceAddress);


    var strSenderAddress = _sender;
    var strSenderBalanceEth = web3.utils.fromWei(senderBalance);

    $("#splitter_state_table #row_sender .col_address"    ).html(strSenderAddress   );
    $("#splitter_state_table #row_sender .col_balance_wei").html(senderBalance      );
    $("#splitter_state_table #row_sender .col_balance_eth").html(strSenderBalanceEth);


    // =====
    //
    var strFirstReceiverAddress = _firstReceiver;
    var strFirstReceiverBalanceEth = web3.utils.fromWei(firstStrangerBalance);

    $("#splitter_state_table #row_recv_1 .col_address"    ).html(strFirstReceiverAddress   );
    $("#splitter_state_table #row_recv_1 .col_balance_wei").html(firstStrangerBalance      );
    $("#splitter_state_table #row_recv_1 .col_balance_eth").html(strFirstReceiverBalanceEth);


    // =====
    //
    var strSecondReceiverAddress = _secondReceiver;
    var strSecondReceiverBalanceEth = web3.utils.fromWei(secondStrangerBalance);

    $("#splitter_state_table #row_recv_2 .col_address"    ).html(strSecondReceiverAddress   );
    $("#splitter_state_table #row_recv_2 .col_balance_wei").html(secondStrangerBalance      );
    $("#splitter_state_table #row_recv_2 .col_balance_eth").html(strSecondReceiverBalanceEth);



    // =====
    //
    var strContractAddress = _splitterInstanceAddress;
    var strContractBalanceEth = web3.utils.fromWei(secondStrangerBalance);

    $("#splitter_state_table #row_contract .col_address"    ).html(strContractAddress   );
    $("#splitter_state_table #row_contract .col_balance_wei").html(contractBalance      );
    $("#splitter_state_table #row_contract .col_balance_eth").html(strContractBalanceEth);

}


async function loadAccountsAsync()
{
    _accounts = await web3.eth.getAccounts();

    _splitterInstanceAddress = 
        await AdkSplitterForTwo.methods
                               .GetContractAddress()
                               .call();



    // TODO: add more addresses in the config
    //
    _sender         = _accounts[0];
    _firstReceiver  = _accounts[1];
    _secondReceiver = _accounts[2];


    await renderState();
}

