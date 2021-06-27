import React, {useEffect, useState} from "react";

const UserComponent = (props) => {
    // get variables
    const {whiteListed, startedProposal, endedProposal, startedVoting} = props
    // get functions
    const {makeProposal} = props
    const [layout, setLayout] = useState("waitingWhiteList")

    const makeProposalButtonHandler = (event) => {
        event.preventDefault()
        let proposalText = event.target.proposal.value
        if(proposalText !== "") {
            makeProposal(proposalText)
        } else {
            console.log("Please enter a proposal")
        }
    }


    if (startedProposal === true) {
        return (
            <div>
                Started Proposals
                <form onSubmit={makeProposalButtonHandler}>
                <input name="proposal" type="text" placeholder="your proposal"/>
                <input type="submit" value="Make a proposal"/>
                </form>
            </div>
        )    
    } 
    else if(endedProposal === true) {
        return (
            <div>
                Ended Proposals, waiting for voting session to start.
            </div>
        )
    }
    else if(startedVoting === true) {
        return (
            <div>
                voting session
            </div>
        )
    }
    else {
        return (
            <div>
                Waiting...
            </div>
        )
    }
}

export default UserComponent