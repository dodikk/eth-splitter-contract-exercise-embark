import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import AdkSplitterForTwo from 'Embark/contracts/AdkSplitterForTwo';
import $ 'jquery';



var _accounts = null;

var _sender         = null;
var _firstReceiver  = null;
var _secondReceiver = null;


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
//    { this.state.web3.utils.fromWei( this.state.senderBalance, 'ether') }

}


async function loadAccountsAsync()
{
    _accounts = await web3.eth.getAccounts();


    // TODO: add more addresses in the config
    //
    _sender         = _accounts[0];
    _firstReceiver  = _accounts[1];
    _secondReceiver = _accounts[2];
}

