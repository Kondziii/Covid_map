import { useRef, useEffect } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {
  select,
  geoPath,
  geoMercator,
  zoom,
  min,
  max,
  median,
  scalePow,
  quantile,
  scaleLinear,
} from 'd3';
import './Map.css';

const colorPalette = {
  cases: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
  active: ['#DAF5FF', '#82A5FF', '#4E49FF', '#313FC6', '#051627'],
  recovered: {
    begin: '#dbead5',
    median: '#008000',
    end: '#132c0d',
  },
  deaths: {
    begin: '#ffdfd4',
    median: '#cc0000',
    end: '#52170b',
  },
};

const Map = (props) => {
  const map = useRef();

  let svg = null;
  const w = 2000;
  const h = 750;

  const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const createLegend = (values, scale) => {
    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linear-gradient');

    values.forEach((value, index) => {
      linearGradient
        .append('stop')
        .attr('offset', `${index * 25}%`)
        .attr('stop-color', `${scale(value)}`);
    });

    svg
      .append('rect')
      .attr('width', '20%')
      .attr('height', '25px')
      .attr('transform', 'translate(15, 570)')
      .style('fill', 'url(#linear-gradient)');

    svg
      .append('rect')
      .attr('width', '25px')
      .attr('height', '25px')
      .attr('transform', 'translate(15, 500)')
      .style('fill', '#aaa');

    svg
      .append('text')
      .text(`- No data available`)
      .attr('class', `legend`)
      .attr('transform', 'translate(50, 518)');

    svg
      .append('text')
      .text('Number of people')
      .attr('class', `legend`)
      .attr('transform', 'translate(15, 560)');

    svg
      .append('text')
      .text('Latest covid-19 statistics:')
      .attr('class', `legend_title`)
      .attr('transform', 'translate(15, 470)');

    svg
      .append('text')
      .text(formatNumber(values[4]))
      .attr('class', `legend`)
      .attr('transform', 'translate(290, 620)');

    svg
      .append('text')
      .text(`${values[0] > 0 ? values[0] : 0}`)
      .attr('class', `legend`)
      .attr('transform', 'translate(15, 620)');
  };

  useEffect(() => {
    select('#map').remove();

    const projection = geoMercator()
      .center([50, 15])
      .scale([w / (2.5 * Math.PI)])
      .translate([w / 2, h / 2]);

    const minProp = min(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const meanProp = median(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const maxProp = max(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const q1 = quantile(
      props.mapData.features,
      0.25,
      (feature) => feature.properties[props.variant]
    );

    const q2 = quantile(
      props.mapData.features,
      0.75,
      (feature) => feature.properties[props.variant]
    );

    const colorScale = scaleLinear()
      .domain([minProp, q1, meanProp, q2, maxProp])
      .range(colorPalette[props.variant]);

    const pathGenerator = geoPath().projection(projection);

    svg = select(map.current)
      .append('svg')
      .attr('id', 'map')
      .attr('width', map.current.offsetWidth)
      .attr('height', map.current.offsetHeight);

    const countriesGroup = svg.append('g').attr('id', 'map');

    countriesGroup
      .selectAll('path')
      .data(props.mapData.features)
      .enter()
      .append('path')
      .attr('class', `country`)
      .attr('d', (feature) => pathGenerator(feature))
      .style('fill', function (d) {
        let value = d.properties[props.variant];
        if (value) {
          return colorScale(value);
        } else {
          return '#aaa';
        }
      })
      .on('mouseover', (event, feature) => {
        props.setSelected(true);
        props.setCountry(feature.properties.name);
        props.setCases(feature.properties.cases);
        props.setRecovered(feature.properties.recovered);
        props.setDeaths(feature.properties.deaths);
        props.setActive(feature.properties.active);
        props.setFlag(feature.properties.flag);
      })
      .on('mouseout', () => {
        props.setSelected(false);
      });

    createLegend([minProp, q1, meanProp, q2, maxProp], colorScale);

    svg.call(
      zoom().on('zoom', (event) => {
        countriesGroup.attr('transform', event.transform);
      })
    );
  }, [props.mapData, props.variant]);

  return (
    <div
      ref={map}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {props.selected && (
        <ArrowDropUpIcon
          style={{
            fontSize: '2rem',
            color: 'white',
            position: 'absolute',
            left: 0,
            bottom: 135,
          }}
        />
      )}
    </div>
  );
};

export default Map;
