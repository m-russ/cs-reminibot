var React = require('react');
var ReactDOM = require('react-dom');

class HelloWorld extends React.Component{
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
                <div> Welcome to Base Station GUI : </div>
                <div>{this.props.userid}</div>
            </div>
        )
    }
}

let root = document.getElementById('root');
ReactDOM.render(
    <HelloWorld />, root
);