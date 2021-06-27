import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import { OwnerComponent, UserComponent } from "./Components";
import "./App.css";

class App extends Component {
  state = {
    userType: "vistor",
    web3: null,
    accounts: null,
    votingContract: null,
    whiteListed: [],
    startedProposal: false,
    endedProposal: false,
    startedVoting: false,
    endedVoting: false,
    proposals : [],
    votes: {},
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log("web3", web3)
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts", accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId)
      const votingDeployedNetwork = VotingContract.networks[networkId]
      console.log("votingDeployedNetwork", votingDeployedNetwork)
      const votingInstance = new web3.eth.Contract(
        VotingContract.abi,
        votingDeployedNetwork && votingDeployedNetwork.address
      )
      // Getting whiteList
      const whiteListed = await votingInstance.methods.getWhiteList().call();
      console.log(await votingInstance.methods.getState().call())
      // Getting current State:
      const getRegisteredProposals = async () => {
        const {votingContract} = this.state
        let registeredProposals = await votingContract.methods.getProposals().call()
        this.setState({proposals: registeredProposals})
      }
      const currentAppState = await votingInstance.methods.getState().call()
      console.log("currentAppState", currentAppState)
      const startedProposal = parseInt(currentAppState) === 1 ? true : false
      const endedProposal = parseInt(currentAppState) === 2 ? true : false
      const startedVoting = parseInt(currentAppState) === 3 ? true : false
      votingInstance.events.ProposalsRegistrationStarted(() => this.setState({startedProposal: true}))
      votingInstance.events.ProposalsRegistrationEnded(() => {this.setState({endedProposal: true, startedProposal: false});console.log("ended proposals")})
      votingInstance.events.ProposalRegistered(getRegisteredProposals)
      console.log(whiteListed)
      this.setState({ 
        web3, 
        accounts, 
        votingContract: votingInstance,
         whiteListed: whiteListed,
         startedProposal: startedProposal,
         endedProposal: endedProposal,
         startedVoting: startedVoting
        });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  addToWhiteList = async (addressText) => {
    const {votingContract, accounts, whiteListed} = this.state
    if (whiteListed.includes(addressText) === false) {
      this.setState((state) => {
        return {whiteListed: [...state.whiteListed, addressText]}
      })
      const addWhiteListAnswer = await votingContract.methods.addToWhiteList(addressText).send({from: accounts[0], gas: 3000000}, (error) => {console.log(error)})
      votingContract.events.VoterRegistered().on('data', (event) => console.log("event", event)).on('error', (error) => console.log(error))
      console.log("addWhiteListAnswer", addWhiteListAnswer)
    } else {
      console.log("Address Already WhiteListed")
    }
  }

  startProposals = async () => {
    const {votingContract, accounts} = this.state
    // START PROPOSAL !!! J'ai egalement rajouter un event ici sans la fonction callBack car j'ai du mal a comprendre comment ca marche
    console.log("STARTING PROPOSAL PHASE")
    const startProposalAnswer = await votingContract.methods.startProposals().send({from: accounts[0]})
    votingContract.events.ProposalsRegistrationStarted().on('data', (event) => console.log(event)).on('error', error => console.log(error))
    console.log("startProposalAnswer", startProposalAnswer)
  }

  endProposals = async () => {
    const {votingContract, accounts} = this.state
    //END PROPOSAL PERIOD  !!! 2 Event ici
     const endProposalsAnswer = await votingContract.methods.endProposals(1).send({from: accounts[0]})
     votingContract.events.ProposalsRegistrationEnded().on('data', (event) => this.cbEventProposalsHaveEnded(event)).on('error', console.error)
     votingContract.events.WorkflowStatusChange().on('data', (event) => this.cbEventStatusChanged(event)).on('error', console.error)
     this.setState({startedProposal: false})
     console.log("endProposalsAnswer", endProposalsAnswer)   
  }

  makeProposal = async (proposal) => {
    const {votingContract, accounts, proposals} = this.state
    // MAKE PROPOSAL !!! Event ici egalement
    if (proposals.includes(proposal) === false) {
      this.setState((state) => {
        sessionStorage.setItem("proposals", JSON.stringify([...state.proposals, proposal]))
        return {proposals: [...state.proposals, proposal]}
      })
      const makeProposalAnswer = await votingContract.methods.proposals(proposal).send({from: accounts[0]})
      votingContract.events.ProposalRegistered().on('data', (event) => this.cbEventProposalHasBeenSubmitted(event)).on('error', console.error)
      console.log("makeProposalAnswer", makeProposalAnswer)  
    } else {
      console.log("Proposal already made")
    }
  }

  startVoting = async () => {
    const {votingContract, accounts} = this.state
    // START PROPOSAL !!! J'ai egalement rajouter un event ici sans la fonction callBack car j'ai du mal a comprendre comment ca marche
    console.log("STARTING VOTING PHASE")
    const startVotingAnswer = await votingContract.methods.startVoting().send({from: accounts[0]})
    votingContract.events.VotingSessionStarted().on('data', (event) => console.log(event)).on('error', error => console.log(error))
    console.log("startVotingAnswer", startVotingAnswer)
    this.setState({startedVoting: true})
  }

  runExample = async () => {
    const {votingContract} = this.state;
    console.log("old state", await votingContract.methods.getState().call())

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
    if (this.state.userType === "vistor") {
      return (
        <div>
          <button onClick={event => this.setState({userType: "owner"})}>Owner Mode</button>
          <button onClick={event => this.setState({userType: "user"})}>User Mode</button>
        </div>
      )
    }
    if (this.state.userType === "owner") {
      return (
      <OwnerComponent 
        whiteListed = {this.state.whiteListed}
        proposals = {this.state.proposals}
        addToWhiteList = {this.addToWhiteList}
        startProposals = {this.startProposals}
        endProposals = {this.endProposals}
        startVoting = {this.startVoting}
        startedProposal = {this.state.startedProposal}
        startedVoting = {this.state.startedVoting}
      />
      )
    }
    else if (this.state.userType === "user") {
      return(
        <UserComponent 
          whiteListed = {this.state.whiteListed}
          startedProposal = {this.state.startedProposal}
          endedProposal = {this.state.endedProposal}
          startedVoting = {this.state.startedVoting}
          endedVoting = {this.state.endedVoting}
          makeProposal = {this.makeProposal}
        />
      )
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
      </div>
    );
  }
}

export default App;
