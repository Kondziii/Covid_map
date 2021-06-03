import { useRef, useEffect } from 'react';
import {
  select,
  geoPath,
  geoMercator,
  zoom,
  min,
  max,
  scalePow,
  median,
  mean,
  scaleLinear,
} from 'd3';
import * as d3 from 'd3';
import './Map.css';

const colorPalette = {
  cases: {
    from: 'rgb(255, 255, 210)',
    to: 'rgb(255, 130, 0)',
  },
  active: {
    from: 'rgb(210, 210, 255)',
    to: 'rgb(0, 0, 130)',
  },
  recovered: {
    from: 'rgb(210, 255, 210)',
    to: 'rgb(0, 130, 0)',
  },
  deaths: {
    from: 'rgb(255, 210, 210)',
    to: 'rgb(130, 0, 0)',
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

  const createLegend = (minValue, maxValue) => {
    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linear-gradient');
    linearGradient
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', `${colorPalette[props.variant].to}`);

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', `${colorPalette[props.variant].from}`);

    svg
      .append('rect')
      .attr('width', 30)
      .attr('height', '60%')
      .attr('transform', 'translate(30, 130)')
      .style('fill', 'url(#linear-gradient)');

    svg
      .append('text')
      .text(formatNumber(maxValue))
      .attr('class', `legend`)
      .attr('transform', 'translate(5, 120)');

    svg
      .append('text')
      .text(`${minValue > 0 ? minValue : 0}`)
      .attr('class', `legend`)
      .attr('transform', 'translate(35, 610)');
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

    const medianProp = mean(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const maxProp = max(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const colorScale = scaleLinear()
      .domain([minProp, medianProp, maxProp])
      .range(['#dbead5', '#008000', '#132c0d']);

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
          return '#ccc';
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

    /////////////////////////
    createLegend(minProp, maxProp);
    ////////////////////////

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
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '13vh',
          height: '84vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: -10,
        }}
      ></div>
    </div>
  );
};

export default Map;
