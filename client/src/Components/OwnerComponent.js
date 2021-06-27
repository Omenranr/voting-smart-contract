import React, {useEffect, useState} from "react";

const OwnerComponent = (props) => {
    // VARIABLES PROPS
    const {whiteListed, startedProposal, proposals, votes} = props
    // FUNCTIONS PROPS
    const {addToWhiteList, startProposals, endProposals, startVoting} = props

    // LOCAL STATE
    const [layout, setLayout] = useState("whiteList")

    useEffect(() => {
        let savedLayout = JSON.parse(sessionStorage.getItem("currentPhase")) || "whiteList"
        console.log(savedLayout)
        setLayout(savedLayout)
    }, [])

    // FUNCTIONS
    const addAddress = (event) => {
        event.preventDefault()
        let addressText = event.target.address.value
        if(addressText.length !== 0) {
            console.log("whitelisting entered address")
            addToWhiteList(addressText)
        } else {
            console.log("please enter a valid address")
        }
    }

    const validateWhiteList = (event) => {
        let newLayout = event.target.value
        setLayout(newLayout)
        sessionStorage.setItem("currentPhase", JSON.stringify(newLayout))
    }

    const startProposalsButtonHandler = (event) => {
        startProposals()
    }

    const endProposalsButtonHandler = (event) => {
        let newLayout = event.target.value
        setLayout(newLayout)
        sessionStorage.setItem("currentPhase", JSON.stringify(newLayout))
        endProposals()
    }

    const startVotingButtonHandler = (event) => {
        let newLayout = event.target.value
        setLayout(newLayout)
        sessionStorage.setItem("currentPhase", JSON.stringify(newLayout))
        console.log("started voting session")
        startVoting()
    }
    
    const endVotingButtonHandler = (event) => {
        
    }

    // JSX RENDERING
    if (layout === "whiteList") {
        return (
            <div>
                <h1>Owner Space</h1>
                <form onSubmit={addAddress}>
                <input type="text" name="address" placeholder="Address To add"/>
                <input type="submit" name="add" value="Add address"/>
                </form>
                <ul>
                    {   
                        whiteListed.map(el => <li key={el}>{el}</li>)
                    }
                </ul>
                <button onClick={validateWhiteList} value="validatedWhiteList">Validate WhiteList</button>
            </div>
        )    
    }
    else if(layout === "validatedWhiteList") {
        return (
            <div>
                <h1>Owner Space</h1>
                <h2>Starting Proposals Page</h2>
                { startedProposal === false ?
                    <div>
                        <p>
                        If you finished creating your whitelist you can start the 
                        proposals phase.
                        <button onClick={startProposalsButtonHandler} value="">Start Proposals Phase</button>
                        </p> 
                        <button onClick={event => setLayout(event.target.value)} value="whiteList">Return to WhiteList</button>
                    </div>
                    :
                    <div>
                        <p>
                        You started the proposals session. Given proposals by users are going to 
                        appear bellow. If you want to end the session you can <button onClick={endProposalsButtonHandler} value="endProposals">Start Voting Phase</button>
                        </p>
                        <h2>List of proposals</h2>
                        <ul>
                            {   
                                proposals.map(el => <li key={el}>{el}</li>)
                            }
                        </ul>                        
                    </div>
                }
            </div>
        )
    }
    else if(layout === "endProposals") {
        return (
            <div>
                <p>
                    Proposals has ended with the following results.
                </p>
                <p>
                    You can start the voting session now: <button onClick={startVotingButtonHandler} value="voting">Start Voting Phase</button>
                </p>
            </div>
        )
    }
    else if(layout === "voting") {
        return (
        <div>
            <p>
            You started the voting session. Given votes by users are going to 
            appear bellow. If you want to end the session you can <button onClick={endVotingButtonHandler} value="result">End Voting Phase</button>
            </p>
            <h2>List of votes</h2>
            <ul>
                {   
                    proposals.map(el => <li key={el}>{el}</li>)
                }
            </ul>                        
        </div>
        )
    }
    else if(layout === "result") {
        return (
            <div>
                Result page
            </div>
        )
    }
}

export default OwnerComponent