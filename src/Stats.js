import { Grid, Avatar, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '16vh',
    background: 'rgba(0,0,0,0.5)',
    position: 'fixed',
    zIndex: 2,
    left: '0',
    bottom: '0',
    display: 'flex',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      height: '35vh',
    },
  },

  optionContainer: {
    fontSize: '1.1rem',
    color: 'white',
    marginLeft: '1%',
  },

  option: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'normal',
    transition: '0.5s',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
    },
  },

  info: {
    marginLeft: '8px',
    fontWeight: 'bold',
    display: 'block',
  },

  origin: {
    color: '#eee',
    position: 'absolute',
    fontSize: '0.8rem',
    bottom: '10px',
    right: '20px',
  },
}));

const Stats = (props) => {
  const classes = useStyles();

  const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const confirmedBtnHandler = () => {
    props.setVariant('cases');
  };

  const activeBtnHandler = () => {
    props.setVariant('active');
  };

  const recoveredBtnHandler = () => {
    props.setVariant('recovered');
  };

  const deathsBtnHandler = () => {
    props.setVariant('deaths');
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.optionContainer}
      >
        <Grid item lg={2}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item lg={6}>
              {props.selected && props.flag && (
                <img src={props.flag} alt='' width='70px' height='40px' />
              )}
            </Grid>
            <Grid item lg={6} style={{ paddingRight: '5px' }}>
              <div
                className={classes.info}
                style={{ width: '100%', fontSize: '1.1rem' }}
              >
                {props.country}
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={10}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <Button className={classes.option} onClick={confirmedBtnHandler}>
                <Avatar
                  style={{
                    marginRight: '10px',
                    background: 'orange',
                    color: 'white',
                  }}
                >
                  !
                </Avatar>
                Confirmed:{' '}
                <span className={classes.info}>
                  {props.cases ? formatNumber(props.cases) : 'unknown'}
                </span>
              </Button>
            </Grid>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <Button className={classes.option} onClick={activeBtnHandler}>
                <Avatar
                  style={{
                    marginRight: '10px',
                    background: '#4444ff',
                    color: 'white',
                  }}
                >
                  ?
                </Avatar>
                Active:{' '}
                <span className={classes.info}>
                  {props.active ? formatNumber(props.active) : 'unknown'}
                </span>
              </Button>
            </Grid>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <Button className={classes.option} onClick={recoveredBtnHandler}>
                {' '}
                <Avatar
                  style={{
                    marginRight: '10px',
                    background: 'green',
                    color: 'white',
                  }}
                >
                  <CheckIcon />
                </Avatar>
                Recovered:{' '}
                <span className={classes.info}>
                  {props.recovered ? formatNumber(props.recovered) : 'unknown'}
                </span>
              </Button>
            </Grid>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <Button className={classes.option} onClick={deathsBtnHandler}>
                <Avatar
                  style={{
                    marginRight: '10px',
                    background: 'red',
                    color: 'white',
                  }}
                >
                  <ClearIcon />
                </Avatar>
                Deaths:{' '}
                <span className={classes.info}>
                  {props.deaths ? formatNumber(props.deaths) : 'unknown'}
                </span>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <p className={classes.origin}>
        Data origin:
        <span style={{ fontStyle: 'italic' }}>https://disease.sh/docs/#/</span>
      </p>
    </div>
  );
};

export default Stats;
