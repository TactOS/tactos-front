import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton';

import CardAtom from './atom_card.jsx'


const START_FETCH_PACKAGES = "START_FETCH_PACKAGES"
function startFetchPackages()
{
  return {
    type: START_FETCH_PACKAGES
  }
}

const SUCCESS_FETCH_PACKAGES = "SUCCESS_FETCH_PACKAGES"
function successFetchPackages(result)
{
  return {
    type: SUCCESS_FETCH_PACKAGES,
    packages: result
  }
}

const ERROR_FETCH_PACKAGES = "ERROR_FETCH_PACKAGES"
function errorFetchPackages()
{
  return {
    type: ERROR_FETCH_PACKAGES
  }
}


function packagesReducer(state = {packages:[]}, action)
{
  switch (action.type)
  {
    case SUCCESS_FETCH_PACKAGES:
      return {
        packages: action.packages
      }
    case ERROR_FETCH_PACKAGES:
      return {packages:[]}
    default:
      return state
  }
}
const store = createStore(packagesReducer, applyMiddleware(thunkMiddleware))

function fetchPackagesAsync()
{
  return function(dispatch) {
    dispatch(startFetchPackages())
    fetch('/api/1/atoms', {method: "get"}).then(function(res){return res.json();}).then(function(json)
    {
      dispatch(successFetchPackages(json))
    });
  }
}

const mapStateToProps = (state) => {
  return {
    packages: state.packages
  }
}

class App extends React.Component
{
  componentDidMount()
  {
    const { dispatch } = this.props
    dispatch(fetchPackagesAsync())
  }
  render()
  {
    let text =
    `
    `
    return <div>
    <Card key='HowToUse' style={{marginTop: 80, marginRight: 12, marginBottom: 12, marginLeft: 12}}>
      <CardHeader title='How to Use TactOS.' titleStyle={{fontSize: '22px'}}/>
      <CardText style={{fontSize: '20px'}}>
      $ git clone https://github.com/tactos/tact<br/>
      $ cd tact<br/>
      # ./tact package_name<br/>
      <br/>
      Requirements<br/>
      curl and gentoolkit.<br/>
      Now support only Gentoo GNU/Linux.<br/>
      TactOS Alt Coming Soon!<br/>
      </CardText>
      <CardActions>
        <RaisedButton label='Github' primary={true} target="_blank" href="http://github.com/tactos"/>
        <RaisedButton label='Build Issue' secondary={true} target="_blank" href="https://github.com/TactOS/gentoo-build-server/issues"/>
        <RaisedButton label='Web Front End Issue' secondary={true} target="_blank" href="https://github.com/TactOS/tactos-front/issues"/>
      </CardActions>
    </Card>
    {
      this.props.packages.map((e, i) =>
      {
        return <CardAtom key={i} atoms={e}/>
      })
    }
    </div>
  }
}

const A = connect(mapStateToProps)(App)

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <div>
        <AppBar
            title='TactOS alpha - Gentoo as a Service'
            showMenuIconButton={false}
            style={{position: "fixed", top: 0}}
            zDepth={2}
        />
        <A />
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
