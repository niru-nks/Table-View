import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerNames: ['NAME', 'COMPANY NAME', 'EMAIL', 'WORK PHONE', 'GST TREATMENT', 'RECEIVABLES', 'PAYBLES'],
      keyNames: ['contact_name', 'company_name', 'email', 'phone', 'gst_treatment', 'outstanding_receivable_amount', 'outstanding_payable_amount'],
      error: false,
      tableData: [],
      msg: 'Success'
    };
  }

  componentDidMount() {
    fetch('http://localhost:5000/contacts')
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (!response || !response.success || !response.data || !response.data.contact) {
          this.setState({
            error: true,
            msg: response.msg
          })
        } else if (!response.data.contact.length) {
          this.setState({
            error: true,
            msg: 'Empty response'
          })
        } else {
          this.setState({
            error: false
          })
          this.populateTable(response.data.contact)
        }
      }, e => {
        this.setState({
          error: true,
          msg: e.toString()
        })
        console.log('This is the error', e);
      })
  }

  populateTable = (data) => {
    let tableData = <table>
      <tr>
        {
          this.state.headerNames.map(e => <th key={e}>{e}</th>)
        }
      </tr>
      {
        data.map(contact => {
          return <tr key={contact.contact_id}>
            {this.state.keyNames.map(key => <td key={key}>{contact[key]}</td>)}
          </tr>
        })
      }
    </table>
    this.setState({
      tableData
    })
  }

  render() {
    return (
      <div className='App' >
        {!this.state.error ? this.state.tableData: <h1>{this.state.msg}</h1>}
      </div>
    );
  }

}


export default App;
