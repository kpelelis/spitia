function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&');
  let params = {};
  hashes.map(hash => {
    let [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

class Houses extends React.Component {
  constructor() {
    super();
    const params = getUrlParams(window.location.search);
    this.state = {
      houses: [],
      search: params.q || '',
      orderBy: params.order || 'date',
      user: params.user || 'kpelelis'
    };
  }

  componentDidMount() {
    fetch(`houses-${this.state.user}.json`)
      .then(r => r.json())
      .then(houses => {
        this.setState({ houses });
      })
      .catch(e => console.log(e));
  }

  onSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  onOrderBy = (e) => {
    this.setState({ orderBy: e.target.value });
  }

  render() {
    if (!this.state.houses) return null;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <input
          value={this.state.search}
          onChange={this.onSearch}
          placeholder='Search'
          style={{
            fontSize: '4rem'
          }}
        />
        <label>Order by</label>
        <select value={this.state.orderBy} onChange={this.onOrderBy}>
          <option value="date">Date Edited</option>
          <option value="name">Name</option>
          <option selected value="price">Price</option>
        </select>
        <ul
          style={{
            margin: 0,
            padding: 0,
            width: '100%',
          }}
        >
          {this.state.houses
            .filter(({ href, description }) =>
              description.toLowerCase().includes(
                this.state.search.toLowerCase()))
            .sort((a, b) => {
              switch(this.state.orderBy) {
                case 'date':
                  return new Date(b.date) - new Date(a.date)
                case 'name':
                  return b.location < a.location ? 1 : -1;
                case 'price':
                  const ap = parseInt(a.price ? a.price.split(' ')[0] : Infinity);
                  const bp = parseInt(b.price ? b.price.split(' ')[0] : Infinity);
                  return ap - bp;
              }
            })
            .map((item, index) => {
              let {
                href,
                description,
                location,
                price,
                surface,
                date
              } = item;
              date = new Date(date);
              return (
                <li
                  style={{
                    listStyle: 'none',
                    margin: '0 0 .5em'
                  }}
                >
                  {((new Date() -date) < 24 *60 * 60 * 1000) && <div class="ribbon">New</div>} 
                  <a
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      padding: '2rem',
                      color: '#303030',
                      display: 'block',
                      background: 'rgba(59,159,226,.15)'
                    }}
                    href={`http://www.xe.gr${href}`}
                    target='blank'
                  >
                    <b>{location}</b>
                    <br/>
                    {price}
                    <br/>
                    {surface}
                    <br/>
                    {description}
                    <br/>
                    {formatDate(date)}
                  </a>
                </li>
              );
            }
          )}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<Houses />, document.getElementById("app"));
