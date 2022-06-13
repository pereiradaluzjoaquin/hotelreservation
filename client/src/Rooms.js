import React from 'react';
import Modal from 'react-modal';


const server = "http://localhost:4000";

 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


const initialState = {
	modalIsOpen: false, roomId: "", roomNumber: 0, roomState: "", reservationId: 0,  roomType: "", rooms: [], modalMessage: "", date: "", guestName:"", idGuest:"", dateCheckIn : "" ,dateCheckOut :""
}
class Rooms extends React.Component{

	constructor(){
		super();
		this.state = initialState;
	    this.afterOpenModal = this.afterOpenModal.bind(this);
	    this.closeModal = this.closeModal.bind(this);
	}
	openModal(roomNumber, room) {
		console.log(room.type);
		//load reservation
		fetch(server + `/api/reservation/${roomNumber}`)
		.then(res => res.json())
		.then(reservation => { 
				console.log(reservation);
				if (reservation) {
					var dateCheckIn = new Date(reservation.dateCheckIn).toISOString().split('T')[0];
					var dateCheckOut = new Date(reservation.dateCheckOut).toISOString().split('T')[0];
					console.log(dateCheckIn + dateCheckOut);
					this.setState({
							roomNumber: roomNumber, roomType: room.type, guestName: reservation.guestName, idGuest:reservation.idGuest, dateCheckIn : dateCheckIn ,dateCheckOut : dateCheckOut
					});
					console.log(this.state);
				}
			});

 	
		if (room.occupied === "occupied") {
			this.setState({modalIsOpen: true, roomId: room._id,  roomState: "occupied"});
		}
		else if (room.occupied === "available"){
			this.setState({modalIsOpen: true,  roomId: room._id, roomType: room.type,  roomState: "available", roomNumber: roomNumber});
		}
		else{
    		this.setState({modalIsOpen: true,  roomId: room._id, roomState: "reserved"});
    	}	


  	}
 
  	afterOpenModal() {
    	var today = new Date().toISOString().split('T')[0];
		this.setState({date: today});
  	}
 
  	closeModal() {
    this.setState({modalIsOpen: false, guestName:"", idGuest:"", dateCheckIn : "" ,dateCheckOut :""});
  	}

	componentDidMount(){
		this.fetchRooms();
		
	}

	fetchRooms(){
		fetch(server + "/api/rooms")
		 .then(response => response.json())
		 .then(data => {
		 	console.log(data);
		 	this.setState({rooms: data});

		 })

	}

AddCheckIn(e){
	e.preventDefault();
    var reservation = {guestName: this.state.guestName, idGuest: this.state.idGuest, roomNumber: this.state.roomNumber, dateCheckIn: this.state.dateCheckIn, dateCheckOut : this.state.dateCheckOut};
	fetch(server + "/api/reservation", {
		method: "POST",
		body: JSON.stringify(reservation),
		headers: {
			"Content-Type": "application/json"
		}

	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		this.setState({reservationId: data._id});
			var roomState= "available";
			var dateIn = new Date(this.state.dateCheckIn).toISOString().split('T')[0];
			var dateout = new Date(this.state.dateCheckOut).toISOString().split('T')[0];
			var dateNow = new Date(Date.now()).toISOString().split('T')[0];
			if (this.state.roomState == "available" && dateIn === dateNow) {
				roomState = "occupied";
			}
			else if (this.state.roomState == "available" && dateout > dateNow) {
				roomState = "reserved";
			}
		//update room status
		this.updateRoomStatus(roomState);


	})
	.catch(error => console.log(error));
}
updateRoomStatus(roomState){
	const room = {type: this.state.roomType, occupied: roomState};
	fetch(server + `/api/rooms/${this.state.roomId}`, {
		method: "PUT",
		body: JSON.stringify(room),
		headers: {
			"Content-Type": "application/json"
		}

	})
	.then(res => res.json())
	.then(data => { 
			console.log(data);
				//clean state}
				this.setState(initialState);
				//fetch rooms
				this.fetchRooms();
				this.closeModal();
		});



}

RemoveReservation(e){
	e.preventDefault();
	fetch(server + `/api/reservation/${this.state.roomNumber}`, {
	method: "DELETE",
	headers: {
		"Content-Type": "application/json"
	}

	})
	.then(res => res.json())
	.then(data => { 
			console.log(data);
			this.updateRoomStatus("available");
		});
}

handleChange(e){
	const {name, value} = e.target;
	this.setState({[name]: value});
}

	render()  {
		const rooms = this.state.rooms.map((room, key) =>				
				<div key= {key}>
			     	<div onClick={this.openModal.bind(this, (key + 1),room)} 
			     	data-toggle="modal" data-target={"roomModal" + (key + 1)} 
			     	className={room.occupied === "occupied" ? "roomOcuppied" : room.occupied === "available" ? "room" : "roomReserved"}>
			     		<div style={{padding: "7px"}}>
			     		 {key + 1}
			     		 <br />
			     		 {room.type} 
			     		</div>
			     	</div>
		     	</div>  		  	
		 );
		var readOnly = null;
		var SaveRemoveReservation = null;
		if (this.state.roomState === "occupied" || this.state.roomState === "reserved"){
			readOnly = "readOnly";
			SaveRemoveReservation = <button type="button" onClick={this.RemoveReservation.bind(this)} className="btn btn-danger"> Remove reservation </button> ;
		}
		else{
			SaveRemoveReservation =	<button type="submit" className="btn btn-primary">Save</button>
		}



		return (
	    <div>
	    <section>
			{rooms}
			 <Modal
	          isOpen={this.state.modalIsOpen}
	          onAfterOpen={this.afterOpenModal}
	          onRequestClose={this.closeModal}
	           style={customStyles}
	          contentLabel="Check-In"
	        	> 

	       <div className="modal-dialog" role="document">
	       {this.state.roomState === "occupied" ?  "Room Occupied" : this.state.roomState === "reserved" ? "Room reserved" : null}
			  <form onSubmit={this.AddCheckIn.bind(this)}>
			    <div className="modal-content">
			      <div className="modal-header">
			      	{this.state.modalMessage}
			        <h5 className="modal-title">Check-In</h5>
			        <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
		      <div className="modal-body">
		       		<div className="form-group">
		       			<label>Guest Name </label>
		       			<input type="text" name="guestName" onChange={this.handleChange.bind(this)} className="form-control" value={this.state.guestName} id="idGuestName" placeholder="Enter Guest Name" readOnly = {readOnly} />
		       		</div>
		       		<div className="form-group">
		       			<label>Id Guest</label>
		       			<input type="text" className="form-control" name="idGuest" onChange={this.handleChange.bind(this)} value={this.state.idGuest} id="idGuest" placeholder="Enter Id Guest"  readOnly = {readOnly} />
		       		</div>
		       		<div className="form-group row">
		       			<div className="col">
		       			<label>Select Date From</label>
		       			<input type="date" min={this.state.today} name="dateCheckIn" onChange={this.handleChange.bind(this)} value={this.state.dateCheckIn} className="form-control" id="dateCheckIn" placeholder="Enter Date Check-In" readOnly = {readOnly} />
		       			</div>
		       			<div className="col">
		       			<label>Select Date To</label>
		       				<input type="date" min={this.state.today} name="dateCheckOut" onChange={this.handleChange.bind(this)} value={this.state.dateCheckOut} className="form-control" id="dateCheckOut" placeholder="Enter Date Check-Out" readOnly = {readOnly} />
		       			</div>

		       		</div>
		      </div>
		      <div className="modal-footer">
		      	{SaveRemoveReservation}
		        <button type="button" className="btn btn-secondary" onClick={this.closeModal} data-dismiss="modal">Close</button>
		      </div>
		    </div>
		 </form>
		
		  </div>
	        </Modal>
		 </section>
	    </div>
	  );

	}
	
}

export default Rooms;
