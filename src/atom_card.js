import React from 'react'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import { red200, red500, red900, green500, blue300, blue900, yellow800, grey700 } from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar'
import DeviceAccessTime from 'material-ui/svg-icons/device/access-time'

export default class CardAtom extends React.Component {
  render() {
    let date = new Date(0)
    date.setUTCSeconds(this.props.atoms.date)

    let downloadLink =
      '/api/1/atoms/' +
      this.props.atoms.repository +
      '/' +
      this.props.atoms.category +
      '/' +
      this.props.atoms.package +
      '/' +
      this.props.atoms.version +
      '/builds/' +
      this.props.atoms.id
    let logLink =
      '/api/1/atoms/' +
      this.props.atoms.repository +
      '/' +
      this.props.atoms.category +
      '/' +
      this.props.atoms.package +
      '/' +
      this.props.atoms.version +
      '/builds/' +
      this.props.atoms.id +
      '/log'

    let f = () => {
      switch (this.props.atoms.status) {
        case 'success':
          return green500
        case 'failed':
          return red500
        case 'compiling':
          return yellow800
        default:
          return grey700
      }
    }
    let statusColor = f()

    let elapsed = this.props.atoms.end - this.props.atoms.start
    let elapsedTime = (Math.floor(elapsed / 3600) ? Math.floor(elapsed / 3600) + " hr ": "") + (Math.floor((elapsed % 3600) / 60) ? Math.floor((elapsed % 3600) / 60) + " min ": "") + ((elapsed % 3600) % 60) + " sec"

    return (
      <Card style={{ borderLeft: '5px solid ' + statusColor, margin: 12 }}>
        <CardHeader
          title={
            this.props.atoms.category +
            '/' +
            this.props.atoms.package +
            '-' +
            this.props.atoms.version +
            '::' +
            this.props.atoms.repository
          }
          subtitle={date.toString()}
          titleColor={statusColor}
        />
        <CardText>
          {this.props.atoms.id}
          {(()=>{if (!isNaN(elapsed)){ return <div><DeviceAccessTime style={{marginLeft: 27}}/><div>{elapsedTime}</div></div>}})()}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.keys(this.props.atoms.use).map(key => {
              if (this.props.atoms.use[key]) {
                return (
                  <Chip key={key} style={{ margin: 4 }} backgroundColor={red200}>
                    <Avatar color={red200} backgroundColor={red900}>
                      {'+'}
                    </Avatar>
                    {key}
                  </Chip>
                )
              } else {
                return (
                  <Chip key={key} style={{ margin: 4 }} backgroundColor={blue300}>
                    <Avatar color={blue300} backgroundColor={blue900}>
                      {'-'}
                    </Avatar>
                    {key}
                  </Chip>
                )
              }
            })}
          </div>
        </CardText>
        <CardActions>
          <RaisedButton disabled={this.props.atoms.status != 'success'} label="Download" href={downloadLink} />
          <RaisedButton label="Log" href={logLink} />
        </CardActions>
      </Card>
    )
  }
}
