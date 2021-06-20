import React, {useState} from "react";

const OwnerComponent = (props) => {
    // VARIABLES PROPS
    const {whiteListed, startedProposal, proposals} = props
    // FUNCTIONS PROPS
    const {addToWhiteList, startProposals, endProposals} = props

    console.log(startedProposal)

    // LOCAL STATE
    const [layout, setLayout] = useState("whiteList")

    // FUNCTIONS
    const addAddress = (event) => {
        event.preventDefault()
        let addressText = event.target.address.value
        if(addressText.length !== 0) {
            console.log("whitelisting entered address")
            addToWhiteList(addressText)
        } else {
            console.log("please enter a valid")
        }
    }

    const startVoting = () => {
        console.log("started voting session")
    }

    const endProposalsButtonHandler = () => {
        setLayout("voting")
        endProposals()
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
                <button onClick={event => setLayout(event.target.value)} value="proposals">Validate WhiteList</button>
            </div>
        )    
    }
    else if(layout === "proposals") {
        return (
            <div>
                <h1>Owner Space</h1>
                <h2>Starting Proposals Page</h2>
                { startedProposal === false ?
                    <div>
                        <p>
                        If you finished creating your whitelist you can start the 
                        proposals phase.
                        <button onClick={startProposals}>Start Proposals Phase</button>
                        </p> 
                        <button onClick={event => setLayout(event.target.value)} value="whiteList">Return to WhiteList</button>
                    </div>
                    :
                    <div>
                        <p>
                        You started the proposals session. Given proposals by users are going to 
                        appear bellow. If you want to end the session you can <button onClick={event => endProposalsButtonHandler()}>Start Voting Phase</button>
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
    else if(layout === "voting") {
        return (
            <div>
                <p>
                    Proposals has ended with the following results.
                </p>
                <p>
                    You can start the voting session now: <button onClick={startVoting}>Start Voting Phase</button>
                </p>
            </div>
        )
    }
}

export default OwnerComponent