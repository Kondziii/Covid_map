import Map from './Map';
import './App.css';
import mapData from './custom.json';
import { useEffect, useState } from 'react';
import { getReport, getTotalReport } from './getData';
import { RingLoader } from 'react-spinners';
import Stats from './Stats';

function App() {
  const [covidStats, setCovidStats] = useState(null);
  const [totalStats, setTotalStats] = useState(null);
  const [country, setCountry] = useState('');
  const [flag, setFlag] = useState('');
  const [cases, setCases] = useState(0);
  const [recovered, setRecovered] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(false);
  const [variant, setVariant] = useState('cases');

  useEffect(() => {
    getReport(mapData).then((data) => {
      setCovidStats(data);
    });
    getTotalReport().then((data) => {
      setTotalStats(data);
    });
  }, []);

  useEffect(() => {
    if (!selected) {
      assignTotalStats();
    }
  });

  const assignTotalStats = () => {
    if (totalStats) {
      setCountry('World');
      setCases(totalStats.cases);
      setRecovered(totalStats.recovered);
      setDeaths(totalStats.deaths);
      setActive(totalStats.active);
      setFlag('');
    }
  };

  return (
    <div className='App'>
      {!covidStats && <RingLoader color='white'></RingLoader>}
      {covidStats && (
        <Map
          setCases={setCases}
          setDeaths={setDeaths}
          setRecovered={setRecovered}
          setCountry={setCountry}
          setSelected={setSelected}
          setActive={setActive}
          setFlag={setFlag}
          mapData={covidStats}
          variant={variant}
          selected={selected}
        ></Map>
      )}
      <Stats
        country={country}
        flag={flag}
        cases={cases}
        recovered={recovered}
        deaths={deaths}
        active={active}
        selected={selected}
        variant={variant}
        setVariant={setVariant}
      ></Stats>
    </div>
  );
}

export default App;
