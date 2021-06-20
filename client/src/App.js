import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, votingContract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId]
      const votingDeployedNetwork = VotingContract.networks[networkId]
      const votingInstance = new web3.eth.Contract(
        VotingContract.abi,
        votingDeployedNetwork && votingDeployedNetwork.address
      )
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, votingContract: votingInstance}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, votingContract } = this.state;

    console.log("old state", await votingContract.methods.getState().call())

    // ADD TO WHITELIST !!! J'ai ajoute des events, ligne 113 il y a un callback, je ne comprend pas trop l'utilite du callback ici...
     //const addWhiteListAnswer = await votingContract.methods.addToWhiteList(accounts[0]).send({from: accounts[0]})
     //votingContract.events.VoterRegistered().on('data', (event) => this.cbEventWhiteListed(event)).on('error', console.error)
     //console.log("addWhiteListAnswer", addWhiteListAnswer)

    // START PROPOSAL !!! J'ai egalement rajouter un event ici sans la fonction callBack car j'ai du mal a comprendre comment ca marche
    //const startProposalAnswer = await votingContract.methods.startProposals("How to save the planet").send({from: accounts[0]})
    //votingContract.events.ProposalsRegistrationStarted().on('data', (event) => this.cbEventProposalsHasStarted(event)).on('error', console.log.error)
    //console.log("startProposalAnswer", startProposalAnswer)


    // MAKE PROPOSAL !!! Event ici egalement 
     //const makeProposalAnswer = await votingContract.methods.proposals("Stop using diesell").send({from: accounts[0]})
     //votingContract.events.ProposalRegistered().on('data', (event) => this.cbEventProposalHasBeenSubmitted(event)).on('error', console.error)
     //console.log("makeProposalAnswer", makeProposalAnswer)

    //END PROPOSAL PERIOD  !!! 2 Event ici  
     //const endProposalsAnswer = await votingContract.methods.endProposals(1).send({from: accounts[0]})
     //votingContract.events.ProposalsRegistrationEnded().on('data', (event) => this.cbEventProposalsHaveEnded(event)).on('error', console.error)
     //votingContract.events.WorkflowStatusChange().on('data', (event) => this.cbEventStatusChanged(event)).on('error', console.error)
     //console.log("endProposalsAnswer", endProposalsAnswer)

    //GET PROPOSALS
    //const getProposalsAnswer = await votingContract.methods.getProposals().call()
    //console.log("getProposalsAnswer", getProposalsAnswer)
    

    //START VOTING PERIOD !!! 2 Event ici 
     //const startVotingAnswer = await votingContract.methods.startVoting().send({from: accounts[0]})
     //votingContract.events.VotingSessionStarted().on('data', (event) => this.cbEventVotingHasBegun(event)).on('error', console.error)
     //votingContract.events.WorkflowStatusChange().on('data', (event) => this.cbEventStatusChanged(event)).on('error', console.error)
     //console.log("startVotingAnswer", startVotingAnswer)

    //PEOPLE VOTE FOR THEIR FAVORITE PROPOSAL !!! Event ici egalement 
    //const votingTimeBabyAnswer = await votingContract.methods.votingTimeBaby(0).send({from: accounts[0]})
    //votingContract.events.Voted().on('data', (event) => this.cbEventHasVoted(event)).on('error', console.error)
    //console.log("votingTimeBabyAnswer", votingTimeBabyAnswer)

    //STOP VOTING PERIOD !!! 2 Event ici 
    //const endVotingAnswer = await votingContract.methods.stopVotes(1).send({from: accounts[0]})
    //votingContract.events.VotingSessionEnded().on('data', (event) => this.cbEventVotingHasEnded(event)).on('error', console.error)
    //votingContract.events.WorkflowStatusChange().on('data', (event) => this.cbEventStatusChanged(event)).on('error', console.error)
    //console.log("endVotingAnswer", endVotingAnswer)

    //COUNT WINNER  !!! Event ici egalement 
    //const winningProposalAnswer = await votingContract.methods.winningProposal().send({from: accounts[0]})
    //votingContract.events.VotesTallied().on('data', (event) => this.cbEventVotesAreTallied(event)).on('error', console.error)
    //console.log("winningProposalAnswer", winningProposalAnswer)

    //DISPLAY WINNER 
    //const showWinnerAnswer = await votingContract.methods.showWinner().call()
    //console.log("showWinnerAnswer", showWinnerAnswer)

       // SHOW NEW STATE
       console.log("new state", await votingContract.methods.getState().call())

    await contract.methods.set(10).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  /// Voici un exemple de callback, je ne voit pas comment l'utiliser mais c'est utile pour recuperer les differents events.
  ///Ici le storageValue n'est pas bon, je dois le remplacer par WhiteListedAddresses par exemple.
  // cbEventWhiteListed = async (event) => {
  //  const { storageValue  } = this.state;
  //
  //   const updatedWhiteList = storageValue.push(event.returnValues[0]);
  //
  //  this.setState({storageValue: updatedWhiteList})
  // }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
