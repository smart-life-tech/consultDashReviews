var Dash = React.createClass({
	getInitialState: function () {
		return {
			rpm: 0,
			mph: 0,
			coolantTemp: 0,
			dash: "defaultDash",
		};
	},
	componentDidMount: function () {
		var that = this;
		this.socket = io();
		this.socket.on('ecuData', function (data) {
			that.setState({ rpm: data.rpm });
			that.setState({ mph: data.mph });
			that.setState({ coolantTemp: data.coolantTemp });
		});
		this.socket.emit('fetchComments');
	},
	needlePosition: function (rpm) {
		percentRPM = rpm / 12000 * 360 + 90;
		needleStyle = {
			transform : 'rotate(' + percentRPM + 'deg)'
		};
		return needleStyle;
	},
	rpmMarker: function (num, background) {
		var rotatePercent = num / 100 * 360 + 180
		tickStyle = {
			transform : 'rotate(' + rotatePercent + 'deg)'
		}
		var divClass = !background ? "rpm__marker" : "rpm__marker--background"
		return (
			<div style={tickStyle} className={divClass}></div>
			);
	},
	backgroundMarkers: function () {
		var rpmMarkers = []
		for (var i = 0; i < 75; i++) {
			rpmMarkers.push(this.rpmMarker(i, true));
		}
		return rpmMarkers;
	},
	rpmMarkers: function () {
		var percentRPM = this.state.rpm / 120;
		var rpmMarkers = []
		var background = false
		for (var i = 0; i < 75; i++) {
			if (i > percentRPM ){
				background = true
			}
			rpmMarkers.push(this.rpmMarker(i, background));
		}
		return rpmMarkers;
	},
	renderMPH: function () {
		var mph = this.state.mph;
		var hundreds = "mph__number mph__number";
		var tens = "mph__number mph__number";
		var ones = "mph__number mph__number";
		if (mph > 100){
			hundreds += "--" + (mph + "")[0]
			tens += "--" + (mph + "")[1]
			ones += "--" + (mph % 10)
		} else if (mph > 9){
			tens += "--" + (mph + "")[0]
			ones += "--" + (mph % 10)
		} else {
			ones += "--" + (mph % 10)
		}
		return (
			<div className="mph__container">
				<div className="mph--background"><span className='mph__number--default'></span><span className='mph__number--default'></span><span className='mph__number--default'></span></div>
				<div className="mph"><span className={hundreds}></span><span className={tens}></span><span className={ones}></span></div>
				<p className="mph__label">MPH</p>
			</div>
		);
	},
	renderRPM: function () {
		var rpm = this.state.rpm;
		var thousands = "rpm__number rpm__number";
		var hundreds = "rpm__number rpm__number";
		var tens = "rpm__number rpm__number";
		var ones = "rpm__number rpm__number";
		var commaClass = rpm > 999 ? "rpm__number--comma" : "rpm__number--hidden-comma"
		if (rpm > 1000){
			thousands += "--" + (rpm + "")[0]
			hundreds += "--" + (rpm + "")[1]
			tens += "--" + (rpm + "")[2]
			ones += "--" + (rpm + "")[3]
		} else if (rpm > 100){
			thousands += "--default"
			hundreds += "--" + (rpm + "")[0]
			tens += "--" + (rpm + "")[1]
			ones += "--" + (rpm % 10)
		} else if (rpm > 9){
			thousands += "--default"
			hundreds += "--default"
			tens += "--" + (rpm + "")[0]
			ones += "--" + (rpm % 10)
		} else {
			thousands += "--default"
			hundreds += "--default"
			tens += "--default"
			ones += "--" + (rpm % 10)
		}
		return (
			<div className="rpm-num__container">
				<div className="rpm"><span className={thousands}></span><span className={commaClass}><img className='comma-image' src='./comma.svg' /></span><span className={hundreds}></span><span className={tens}></span><span className={ones}></span></div>
				<div className="rpm--background"><span className='rpm__number--default'></span><span className='rpm__number--default'></span><span className='rpm__number--default'></span><span className='rpm__number--default'></span></div>
			</div>
		);
	},
	tempMarker: function (num, background) {
		var divClass = !background ? "temp__marker" : "temp__marker--background"
		var colors = ["#7BE7EC", "#89E8DC", "#96E9CE", "#A0EAC1", "#ABEBB4", "#BAEDA4", "#C5ED96", "#D1EE88", "#DDF07B", "#ECF16A", "#F0E966", "#F0DD68", "#F1D069", "#F2C36B", "#F3C36B", "#F4AA6E", "#F49D6F", "#F58F71", "#F58372", "#F77674"]
		style = {}
		if (!background){
			style = {
				backgroundColor : colors[num-1]
			}
		}
		return (
			<div style={style} className={divClass}></div>
			);
	},
	tempMarkers: function (temp) {
		tempPercent = temp / 210 * 20
		var tempMarkers = []
		background = true;

		for (var i = 20; i > 0; i = i - 1) {
			if (tempPercent > i){
				background = false;
			}
			tempMarkers.push(this.tempMarker(i, background));
		}
		return tempMarkers;
	},
	backgroundTempMarkers: function () {
		var tempMarkers = []
		for (var i = 0; i < 20; i++) {
			tempMarkers.push(this.tempMarker(i, true));
		}
		return tempMarkers;
	},
	defaultDash: function () {
		return (
			<span className='neon-dash-container'>
				<div className="rpm__container">
					{ this.rpmMarkers() }
					{ this.renderMPH() }
				</div>
				<div className="small-num__container">
						{ this.renderRPM() }
						<p className="rpm__label">RPM</p>
				</div>
				<div className="temp__container">
						{this.tempMarkers(this.state.coolantTemp)}
				</div>
			</span>
		);
	},
	numbersDash: function () {
		return (
			<span className='neon-dash-container'>
				TESTING
			</span>
		);
	},
	chooseDash: function (dashChoice) {
		var dash = {}
		this.state.dash = dashChoice;
		switch (dashChoice) {
		  case "defaultDash":
		    dash = this.defaultDash();
		    break;
			case "numbersDash":
				dash = this.numbersDash();
				break;
		  default:
		    dash = this.defaultDash();
		}
		return (
			dash
		);
	},

	render: function() {

		return (
			<div className="content-container">
				{/*<div className="dash-changer__container">
					<a onClick={this.chooseDash.bind(this, 'numbersDash')}>Numbers Dash</a>
					<a onClick={this.chooseDash.bind(this, 'defaultDash')}>Default Dash</a>
				</div> */}
				{this.chooseDash(this.state.dash)}
			</div>
		);
	}
});

React.render(
	<Dash/>,
	document.getElementById('content')
);
