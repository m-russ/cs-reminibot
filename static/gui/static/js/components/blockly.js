import React from 'react';
import axios from 'axios';

/**
 * Component for the Blockly sandbox
 */
export default class MinibotBlockly extends React.Component {
  constructor(props) {
    super(props);
    this.scriptToCode = this.scriptToCode.bind(this);
    this.state = {
      blockly_filename: 'myXmlBlocklyCode.xml',
      data: "",
      filename: "myPythonCode.py"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleScriptChange = this.handleScriptChange.bind(this);
    this.download = this.download.bind(this);
    this.run_blockly = this.run_blockly.bind(this);
    this.run_script = this.run_script.bind(this);
    this.copy = this.copy.bind(this);
    this.upload = this.upload.bind(this);
  }

  /* handles input change for file name and coding textboxes */
  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleScriptChange(event) {
    console.log("WORKED!!!")
    this.setState({data: event.target.value});
    console.log(this.state.data);
  }

  /* Runs after component loads - this generates the blockly stuff */
  componentDidMount() {
    var _this = this;
    _this.workspace = window.Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      trashcan: true,
      scroll: true
    });

    /* Realtime code generation
          (Every drag/drop or change in visual code will be
          reflected in actual code view) */
    _this.workspace.addChangeListener(function(event) {
      console.log('workspace change listener');
      _this.scriptToCode();
    });

    /* Loads blockly state from parent component */
    if (this.props.blockly_xml) {
      var xml = Blockly.Xml.textToDom(this.props.blockly_xml);
      Blockly.Xml.domToWorkspace(xml, _this.workspace);
    }
  }

  /* Helper for realtime code generation (Blockly => Python)
  Stores blockly state in parent component so it can load the previous state after switching react tabs
  https://developers.google.com/blockly/guides/get-started/web
  */
  scriptToCode() {
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    this.props.setBlockly(xml_text);

    document.getElementById('data').innerText = window.Blockly.Python.workspaceToCode(this.workspace);
    document.getElementById('blockly').value = window.Blockly.Python.workspaceToCode(this.workspace);
    //document.getElementById('blockly').value = window.Blockly.Python.workspaceToCode(this.workspace);

    console.log(blockly.value);
  }

  /* DOWNLOAD FUNCTION
       Allows users to download raw code as a file. Users must
       manually input file name and file ext.
    */
  download(event) {
    event.preventDefault();
    var element = document.createElement('a');
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    var filename = this.state.blockly_filename;
    if (filename.substring(filename.length - 4) != '.xml') {
      filename += '.xml';
    }
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(xmlText)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  upload(event) {
    var _this = this;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      _this.state.data = event.target.result;
      document.getElementById('data').value = event.target.result;
    };
    reader.readAsText(file);
  }

  run_blockly(event){
    console.log(name);
    axios({
        method:'POST',
        url:'/start',
        data: JSON.stringify({
            key: 'SCRIPTS',
            value: blockly.value,
            bot_name: name
            // bot_name: "Hi"
        }),
    })
    .then(function(response) {
        console.log(blockly.value);
        console.log('sent script');
    })
    .catch(function (error) {
        console.warn(error);
    });
  }

  run_script(event){
    console.log(name);
    axios({
        method:'POST',
        url:'/start',
        data: JSON.stringify({
            key: 'SCRIPTS',
            value: this.state.data,
            bot_name: name
        }),
    })
    .then(function(response) {
        console.log(axois.data.value);
        console.log('sent script');
    })
    .catch(function (error) {
        console.warn(error);
    });
}

  copy(event){
    document.getElementById("textarea").value = blockly.value;
    this.setState({data: blockly.value});
  }

  loadFileAsBlocks(event) {
    var xmlToLoad = document.getElementById('blockUpload').files[0];
    var xmlReader = new FileReader();
    xmlReader.onload = function(event) {
      var textFromFileLoaded = event.target.result;
      console.log(textFromFileLoaded);
      var dom = Blockly.Xml.textToDom(textFromFileLoaded);
      Blockly.getMainWorkspace().clear();
      Blockly.Xml.domToWorkspace(dom, Blockly.getMainWorkspace());
    };

    xmlReader.readAsText(xmlToLoad, 'UTF-8');
  }

  render() {
    var blocklyStyle = { margin: '0', height: '67vh'};
    return (
      <div id="blockyContainer" class="row">
      <div id="blockly" className="box" class="col-md-7">
        <div id="blocklyDiv" style={blocklyStyle} align="left">
          Blockly
        </div>
        <br />
        Blockly File Name:{' '}
        <input
          type="text"
          name="blockly_filename"
          value={this.state.blockly_filename}
          onChange={this.handleInputChange}
        />
        <button id="blocklySubmit" onClick={this.download}>
          Download
        </button>&nbsp;&nbsp;
        <button id="blockyRun" onClick={this.run_blockly}>
          Run
        </button>
        <form>
          <input
            type="file"
            id="blockUpload"
            multiplesize="1"
            accept=".xml"
            onChange={this.loadFileAsBlocks}
          />
        </form>
        <br />

        <div id="Python">
      Python
      <div> File name:  <input type="text" name="filename" value={this.state.filename} onChange={this.handleFileNameChange}/> </div>
      <div> <textarea id = "textarea" onChange={this.handleScriptChange} /></div>
      <button id="submit" onClick={this.download}>Download</button>
      <button id="run" onClick={this.run_script}>Run Code</button>
      <button id="save" onClick={this.save}>Save Code</button>
      <button id="copy" onClick={this.copy}>Copy Code</button>
      <div>{this.state.data}</div>
      <div>{this.state.filename}</div>
      </div>

      </div>
      <div id="data" class="col-md-5">
      </div>

      </div>
    );
  }
}