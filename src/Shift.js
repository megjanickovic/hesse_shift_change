// Imports
import React, { Component } from "react";
 
// Displays an individual shift
class Shift extends Component {

  // Need to get shift data from database using the api
  // Data will be stored in this.state.shift
  // The shift data for this page is based off of the id that is passed to it
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      shift: [],
    }
  }

  // When the component is loaded, get the data
  componentDidMount() {
    return fetch(`/api/shift/${this.state.id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          shift: responseJson.data
        });
    })
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
	      <td>Shift Date</td>
              <td>{this.state.shift.shiftDate}</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>{this.state.shift.shiftTime}</td>
	    </tr>
            <tr>
	      <td>Posted By</td>
              <td>{this.state.shift.postedBy}</td>
            </tr>
            <tr>
	      <td>Covered By</td>
              <td>{this.state.shift.coveredBy}</td>
            </tr>
            <tr>
              <td>Help Session?</td>
	      <td>{this.state.shift.helpSession}</td>
            </tr>
	    <tr>
              <td>Major Preference?</td>
              <td>{this.state.shift.majorPreference}</td>
            </tr>
	    <tr>
              <td>Year Preference?</td>
	      <td>{this.state.shift.yearPreference}</td>
	    </tr>
            <tr>
              <td>Comments?</td>
  	      <td>{this.state.shift.comments}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button">Cover this shift</button>
        </div>
      </div>
    );
  }
}
 
export default Shift;
