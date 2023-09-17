import React from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import Svg, { G, Path, Circle, Rect } from 'react-native-svg';
import Pen from '../tools/pen'
import Point from '../tools/point'


export default class Pad extends React.Component {

  constructor(props) {
    super()
    this.state = {
      tracker: 0,
      currentPoints: [],
      previousStrokes: [],
      previousStrokesCount: 0,
      shape2: 'none',
      color: 'black',
      fill: 'none',
      strokeWidth: 4,
      pen: new Pen(),
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    })
    const rewind = props.rewind || function () { }
    const clear = props.clear || function () { }

    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
    }

  }

  componentDidMount () {
    if(this.props.strokes)
      this.setState({strokes: this.props.strokes})
  }

  componentDidUpdate () {
    if(this.props.enabled == false && this.props.strokes !== undefined && this.props.strokes.length !== this.state.previousStrokes.length)
      this.setState({ previousStrokes: this.props.strokes || this.state.previousStrokes })
  }

  rewind = () => {
    if (this.state.currentPoints.length > 0 || this.state.previousStrokes.length < 1) return
    let strokes = this.state.previousStrokes
    strokes.pop()

    this.state.pen.rewindStroke()

    this.setState({
      previousStrokes: [...strokes],
      currentPoints: [],
      tracker: this.state.tracker - 1,
    })

    this._onChangeStrokes([...strokes])
  }

  clear = () => {
    this.setState({
      previousStrokes: [],
      currentPoints: [],
      tracker: 0,
    })
    this.state.pen.clear()
    this._onChangeStrokes([])
  }

  onTouch(evt) {
    if (this.props.enabled == false) return;
    let x, y, timestamp, color, strokeWidth, fill, shape2
    [x, y, timestamp, color, strokeWidth, fill, shape2] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.timestamp, this.props.color, this.props.strokeWidth, this.props.fill, this.props.shape2]

    let newCurrentPoints = this.state.currentPoints
    newCurrentPoints.push({ x, y, timestamp, color, strokeWidth, fill, shape2 })

    this.setState({
      previousStrokes: this.state.previousStrokes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker
    })
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let strokes = this.state.previousStrokes
    if (this.state.currentPoints.length < 1) return

    var points = this.state.currentPoints
    this.state.pen.addStroke(this.state.currentPoints)

    this.setState({
      previousStrokes: [...strokes, points],
      strokes: [],
      currentPoints: [],
      tracker: this.state.tracker + 1,
    })
    this._onChangeStrokes([...strokes, points])
  }

  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  }

  _onChangeStrokes = (strokes) => {
    if (this.props.onChangeStrokes) this.props.onChangeStrokes(strokes)
  }

  render() {
    var props = this.props.enabled != false ? this._panResponder.panHandlers : {}

    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.drawContainer,
          this.props.containerStyle,
        ]}>
        <View style={styles.svgContainer} {...props}>
          <Svg style={styles.drawSurface}>
            <G>
            <Rect x={-100} y={0} width={5000} height={5000}
                      stroke= 'white'
                      strokeWidth={100}
                      fill= 'white' />
              {this.state.previousStrokes.map((e) => {
                
                var points = [];
                if (e[0].shape2 == 'none')
                {
                  for (var i in e) {
                let newPoint = new Point(e[i].x, e[i].y, e[i].timestamp, e[i].color, e[i].strokeWidth, e[i].fill, e[i].shape2)
                  points.push(newPoint)
                }
   
                return (<Path
                  key={e[0].timestamp}
                  d={this.state.pen.pointsToSvg(points)}
                  stroke={e[0].color}
                  strokeWidth={e[0].strokeWidth}
                  fill={e[0].fill}
                />)
              }

                if (e[0].shape2 == 'line')
                {
                let len = 0;
                for (var i in e)
                {
                  len++;
                }

                let newPoint = new Point(e[0].x, e[0].y, e[0].timestamp, e[0].color, e[0].strokeWidth, e[0].fill, e[0].shape2)
                  points.push(newPoint)
                newPoint = new Point(e[len - 1].x, e[len - 1].y, e[len - 1].timestamp, e[len - 1].color, e[len - 1].strokeWidth, e[len - 1].fill, e[len - 1].shape2)
                points.push(newPoint)

                  return (<Path
                key={e[0].timestamp}
                  d={this.state.pen.pointsToSvg(points)}
                  stroke={e[0].color}
                  strokeWidth={e[0].strokeWidth}
                  fill={e[0].fill}
                />)
                }

                if (e[0].shape2 == 'circle')
                {               
                 
                    return (
                      <Circle cx={e[0].x} cy={e[0].y} r={(Math.abs(e[e.length - 1].x - e[0].x))} 
                      stroke={e[0].color}
                      strokeWidth={e[0].strokeWidth}
                      fill={e[0].fill} />
                    )

                }
                if (e[0].shape2 == 'rect')
                {

                    return (
                      <Rect x={e[0].x} y={e[0].y} width={(Math.abs(e[e.length - 1].x - e[0].x))} height={(Math.abs(e[e.length - 1].y - e[0].y))}
                      stroke={e[0].color}
                      strokeWidth={e[0].strokeWidth}
                      fill={e[0].fill} />
                    )

                }
                
              }
              )
              }
     
              <Path
                key={this.state.tracker}
                d={this.state.pen.pointsToSvg(this.state.currentPoints)}
                stroke={this.props.color || this.color}
                strokeWidth={this.props.strokeWidth || this.state.strokeWidth}
                fill={this.props.fill || this.fill}
              /> 

            </G>

          </Svg>

          {this.props.children}
        </View>
        <View style = {{width: '100%', height: '10%', flexDirection: 'row', top: '21%', right: '-10%'}}>
        <TouchableOpacity style={styles.props_for_button} onPress={this.clear}>
          <Image source={require('./trash.png')}
            style={styles.image_}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.props_for_button} onPress={this.rewind}>
          <Image source={require('./undo.png')}
            style={styles.image_}/>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',

  },
  svgContainer: {
    flex: 1,
  },
  drawSurface: {
    flex: 1,
  },
  props_for_button: {
    width: '33%',
    textAlign: 'center',
    top: '-20%'
  },
  image_:
  {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },

})