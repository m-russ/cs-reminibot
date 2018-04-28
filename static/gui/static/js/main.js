var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');

class AddBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot_name: "",
            bot_list: [],
            selected_bot: "",
            power: 0
        };

        this.updateInputValue = this.updateInputValue.bind(this);
        this.addBotListener = this.addBotListener.bind(this);
        this.selectBotListener = this.selectBotListener.bind(this);
        this.buttonMapListener = this.buttonMapListener.bind(this);
    }

    updateInputValue(event) {
        this.state.bot_name = event.target.value;
        console.log("discover bot");
        const _this = this;
        axios({
            method:'POST',
            url:'/start',
            data: JSON.stringify({
                key: "DISCOVERBOTS"
            })
            })
                .then(function(response) {
                    console.log(response.data);
            })
                .catch(function (error) {
                    console.log(error);
        })
    }

    updatePowerValue(event) {
        this.state.power = event.target.value;
    }

    addBotListener(event) {
        let li = this.state.bot_list;
        let bot_name = this.state.bot_name
        li.push(bot_name);
        this.setState({bot_list: li, selected_bot: bot_name});

        const _this = this;
        axios({
            method:'POST',
            url:'/start',
            data: JSON.stringify({
                key: "CONNECTBOT",
                bot_name: this.state.bot_name
            })
            })
                .then(function(response) {
                    console.log('Succesfully Added');
            })
                .catch(function (error) {
                    console.log(error);
        })
    }

    selectBotListener(event) {
        let bot_name = event.target.value;
        this.setState({selected_bot: bot_name});
    }

    buttonMapListener(value) {
        const _this = this;
        axios({
            method:'POST',
            url:'/start',
            data: JSON.stringify({
                key: "WHEELS",
                bot_name: _this.state.selected_bot,
                direction: value,
                power: _this.state.power,
            })
            })
                .then(function(response) {
            })
                .catch(function (error) {
                    console.log(error);
        })
    }

     /* removes selected object from list*/
    deleteBotListener(event) {
        console.log("handle remove");
        console.log(this.state);
        var li = this.state.items;
        //supposed to delete a bot from the list but i'm bad at react
        //console.log("type: " + li[event.idx].type);
        //li.splice(event.idx, 1);
        //this.setState({items: li});
        /*axios({
            method:'POST',
            url:'/removeBot',
            data: JSON.stringify({name: this.props.currentBot}),
        })
        .then(function(response) {
            console.log('removed bot successfully');
        })
        .catch(function (error) {
            console.warn(error);
        });*/
    }

    render() {
        var styles = {
            Select: {
                marginLeft: '10px',
                marginRight: '10px'
            },
            Button: {
                marginLeft: '10px',
                marginRight: '10px',
                float: 'left'
            }
        }
        var _this = this;
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <div>Bot Name:</div>
                            <form>
                                <label>
                                    <input type="text" name="bot_name" onChange={evt => this.updateInputValue(evt)}/>
                                </label>
                            </form>
                            </td>
                            <td><button style={styles.Button} onClick={this.addBotListener}>Add Bot</button></td>
                        </tr>
                        <tr>
                        <td><div> Bot List: </div></td>
                        <td><select style={styles.Select} onChange={this.selectBotListener}>
                            {this.state.bot_list.map(function(bot_name, idx){
                                return <option
                                            key={idx}
                                            value={bot_name}>
                                            {bot_name}</option>
                                })
                            }
                            </select></td>
                        <td><button style={styles.Button} bot_list={this.state.bot_list}
                                            onClick = {() => _this.deleteBotListener()}>Remove</button></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    Movement
                    <table>
                        <tbody>
                        <tr>
                            <td></td>
                            <td><button className="btn btn-f" onClick={() => this.buttonMapListener("forward")}>forward</button></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><button className="btn btn-l" onClick={() => this.buttonMapListener("left")}>left</button></td>
                            <td><button className="btn btn-s" onClick={() => this.buttonMapListener("stop")}>stop</button></td>
                            <td><button className="btn btn-r" onClick={() => this.buttonMapListener("right")}>right</button></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button className="btn btn-b" onClick={() => this.buttonMapListener("backward")}>backward</button></td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                    <form>
                        <label>
                            Power
                            <input type="text" name="wheel_power" onChange={evt => this.updatePowerValue(evt)}/>
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

class ClientGUI extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    updateInputValue(event) {
        this.setState({name: event.target.value});
    }

    render() {
        return (
            <div>
                <div> Welcome to Client GUI : </div>
                <AddBot/>
            </div>
        )
    }
}

let root = document.getElementById('root');
ReactDOM.render(
    <ClientGUI />, root
);