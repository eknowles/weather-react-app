class Weather extends React.Component {

  render() {
    const forecast = this._buildForecast();

    return <div className="weather">
      <WeatherHeader
        location={this.state.weather.location.city}
        temp={this.state.weather.item.condition.temp}
        text={this.state.weather.item.condition.text}
        unit={this.state.weather.units.temperature}/>
      <div className="forecast">
        {forecast}
      </div>
      <form onSubmit={this._handleSubmit.bind(this)} className="hide">
        <label htmlFor="place">Search</label>
        <input type="text" id="place" name="place"/>
        <button type="submit">Update</button>
      </form>
    </div>;
  }

  constructor() {
    super();
    this.state = {
      search: 'London, England',
      weather: {
        units: {
          temperature: 'C'
        },
        location: {
          city: 'Loading'
        },
        item: {
          title: '',
          condition: {
            temp: 0,
            text: ''
          },
          forecast: []
        }
      }
    };
  }

  componentDidMount() {
    this._fetchWeather();
  }

  _handleSubmit(e) {
    e.preventDefault();
    let v = document.getElementById('place').value;
    this.setState({search: v});
    this._fetchWeather();
  }

  _buildForecast() {
    return this.state.weather.item.forecast.map(d => {
      return (<WeatherForecast key={d.date} day={d.day} high={d.high} low={d.low} text={d.text} code={d.code} date={d.date}/>);
    });
  }

  _fetchWeather() {
    jQuery.getJSON({
      method: 'GET',
      data: {
        q: `select * from weather.forecast 
            where woeid in (select woeid from geo.places(1) 
            where text="${this.state.search}")`,
        format: 'json',
        env: 'store://datatables.org/alltableswithkeys'
      },
      url: 'https://query.yahooapis.com/v1/public/yql'
    }).success(res => {
      this.setState({weather: res.query.results.channel});
    });
  }
}

class WeatherHeader extends React.Component {
  render() {
    return <div className="weather-header">
      <div className="weather-header--location">{this.props.location}</div>
      <div className="weather-header--text">{this.props.text}</div>
      <div className="weather-header--temp">{this.props.temp}&deg;</div>
    </div>;
  }

}

class WeatherForecast extends React.Component {

  // condition codes taken from https://developer.yahoo.com/weather/documentation.html#item
  // icons from https://erikflowers.github.io/weather-icons/

  render() {
    const icon = `wi wi-yahoo-${this.props.code}`;

    return <div className="forecast--item">
      <div className="col day">{this._shortDayToLong(this.props.day)}</div>
      <div className="col icon"><i className={icon}></i></div>
      <div className="col high">{this.props.high}</div>
      <div className="col low">{this.props.low}</div>
    </div>
  }


  _shortDayToLong(day) {
    let week = {
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday'
    };
    return week[day];
  }
}

ReactDOM.render(<Weather/>, document.getElementById('component'));
