import { useRef, useEffect, useState } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { select, geoPath, geoMercator, zoom, min, max, scalePow } from 'd3';
import './Map.css';

const colorPalette = {
  cases: ['white', 'rgb(255,165,0)'],
  active: ['white', 'blue'],
  recovered: ['white', 'green'],
  deaths: ['white', 'red'],
};

const Map = (props) => {
  const map = useRef();
  const [indicator, setIndicator] = useState(null);

  let svg = null;
  const w = 2000;
  const h = 750;

  const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const createLegend = (minValue, maxValue, scale) => {
    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linear-gradient');

    for (let i = 0; i <= 100; i++) {
      linearGradient
        .append('stop')
        .attr('offset', `${i}%`)
        .attr('stop-color', `${scale((i / 100) * maxValue)}`);
    }

    svg
      .append('rect')
      .attr('width', '350px')
      .attr('height', '25px')
      .attr('transform', 'translate(15, 560)')
      .style('fill', 'url(#linear-gradient)');

    svg
      .append('rect')
      .attr('width', '25px')
      .attr('height', '25px')
      .attr('transform', 'translate(15, 490)')
      .style('fill', '#aaa');

    svg
      .append('text')
      .text(`- No data available`)
      .attr('class', `legend`)
      .attr('transform', 'translate(50, 508)');

    svg
      .append('text')
      .text('Number of people')
      .attr('class', `legend`)
      .attr('transform', 'translate(15, 550)');

    svg
      .append('text')
      .text('Latest covid-19 statistics:')
      .attr('class', `legend_title`)
      .attr('transform', 'translate(15, 460)');

    svg
      .append('text')
      .text(formatNumber(maxValue))
      .attr('class', `legend`)
      .attr('transform', 'translate(310, 620)');

    svg
      .append('text')
      .text(`${minValue > 0 ? minValue : 0}`)
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

    const maxProp = max(
      props.mapData.features,
      (feature) => feature.properties[props.variant]
    );

    const colorScale = scalePow()
      .exponent(0.3)
      .domain([minProp, maxProp])
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
        setIndicator((feature.properties[props.variant] / maxProp) * 350);
      })
      .on('mouseout', () => {
        props.setSelected(false);
      });

    createLegend(minProp, maxProp, colorScale);

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
            fontSize: '3rem',
            color: 'white',
            position: 'absolute',
            left: !indicator ? '-9' : `${indicator - 9}`,
            bottom: 135,
          }}
        />
      )}
    </div>
  );
};

export default Map;
