import React from 'react';
const server = "http://localhost:4000";



class RoomModal extends React.Component{

constructor(){
	super();
	this.state = {date: "", guestName:"", idGuest:"", dateCheckIn : "" ,dateCheckOut :""};
}


componentDidMount(){
	var today = new Date().toISOString().split('T')[0];
	this.setState({date: today});
}

AddCheckIn(e){
	e.preventDefault();
	var reservation = {guestName: this.state.guestName, idGuest: this.state.idGuest, roomNumber: this.props.roomNumber, dateCheckIn: this.state.dateCheckIn, dateCheckOut : this.state.dateCheckOut};
	fetch(server + "/api/reservation", {
		method: "POST",
		body: JSON.stringify(reservation),
		headers: {
			"Content-Type": "application/json"
		}

	})
	.then(res => res.json())
	.then(data => console.log(data))
	.catch(error => console.log(error));
	console.log(this.state);
}
handleChange(e){
	const {name, value} = e.target;
	this.setState({[name]: value});
}

render(){

	return(
		<div className="modal fade" id={"roomModal" + this.props.roomNumber} tabIndex="-1" role="dialog">
		  <div className="modal-dialog" role="document">
		  <form onSubmit={this.AddCheckIn.bind(this)}>
		    <div className="modal-content">
		      <div className="modal-header">
		        <h5 className="modal-title">Check-In</h5>
		        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div className="modal-body">
		       		<div className="form-group">
		       			<label>Guest Name </label>
		       			<input type="text" name="guestName" onChange={this.handleChange.bind(this)} className="form-control" id="idGuestName" placeholder="Enter Guest Name" />
		       		</div>
		       		<div className="form-group">
		       			<label>Id Guest</label>
		       			<input type="text" className="form-control" name="idGuest" onChange={this.handleChange.bind(this)} id="idGuest" placeholder="Enter Id Guest" />
		       		</div>
		       		<div className="form-group row">
		       			<div className="col">
		       			<label>Select Date From</label>
		       			<input type="date" min={this.state.today} name="dateCheckIn" onChange={this.handleChange.bind(this)} className="form-control" id="dateCheckIn" placeholder="Enter Date Check-In" />
		       			</div>
		       			<div className="col">
		       			<label>Select Date To</label>
		       				<input type="date" min={this.state.today} name="dateCheckOut" onChange={this.handleChange.bind(this)}  className="form-control" id="dateCheckOut" placeholder="Enter Date Check-Out" />
		       			</div>

		       		</div>
		      </div>
		      <div className="modal-footer">
		        <button type="submit" className="btn btn-primary">Save</button>
		        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
		      </div>
		    </div>
		 </form>
		  </div>
		</div>




	);
}



}


export default RoomModal;