/*
PainterApp
Author: Sowresh

This is a simple drawing app that allows the user to draw freehand, straight lines, circles, and rectangles. The default stroke color is black, the default strokewidth is 4, the default fill color is none, and the default shape is none(or freehand).

- When pressing the brush icon, a modal appears and displays a color wheel that is used to change the stroke color. If the user wants to erase what they have already drawn, then they can press the button at the bottom of the screen that says “Erase”. Pressing the X button at the top of the screen will close the color wheel, sending the user back to the canvas.

- When pressing the bucket icon, a modal appears and displays a color wheel that is used to change the fill color. If the user wants no fill, then they can press the button at the bottom of the screen that says “No Fill”. Pressing the X button at the top of the screen will close the color wheel, sending the user back to the canvas.

- When pressing the multi-lines icon, a modal appears and displays a slider that can be used to change the strokewidth of the pen. The slider’s minimum value is 0 and maximum value is 100 so the user cannot get a strokewidth that is out of this range. One thing to keep in mind is that before the user moves the slider, the previous strokewidth is displayed. However, the slider is at the 0th value, so if the user wants a strokewidth of 0 and/or the strokewidth display to update accordingly, they have to move the slider.(This is also mentioned in the limitations section).

- When pressing the curved line icon, the user will be able to freehand draw.

- When pressing the line icon, the user will be able to draw straight lines. How this works is that the user will freehand draw whatever they want and once they let go of the screen, the program will create a straight line between the point at which the user started drawing and the point at which the user stopped drawing.

- When pressing the circle icon, the user will be able to draw circles. How this works is similar to the line in the sense that they will first freehand draw. Once the user lets go of the screen, the program will draw a circle with the following criteria:
  1. The starting point is the center of the circle.
  2. The length across the x-axis between the first and last points of the freehand draw represents the radius of the circle. This means that if the drawn item is slanted or takes up any space in the y-dimension, that actual length will not be equal to the radius of the created circle.
With this in mind, it is wise to simply draw a line or arc of some sort where the user can easily imagine what the circle drawn by the program will look like. Any other freehand draw may not produce the most accurate results.

- When pressing the rectangle icon, the user will be able to draw rectangles. How this works is similar to the line in the sense that they will first freehand draw. Once the user lets go of the screen, the program will draw a rectangle with the following criteria:
  1. The starting point is the point at which the rectangle is created.
  2. The distance across the x-axis between the first and last points of the freehand draw represents the width of the rectangle while the distance across the y-axis between the first and last points represents the length of the rectangle.
With this in mind, it is wise to draw an L shape of some sort because if looked at from another perspective, it can be shown that a rectangle is made up of 2 L’s where one is upside down. If the starting point is at the top of the L while the ending point is at the bottom of the L, then the first and last points will be x width apart and y length apart, where then the rectangle is created. In most cases, when drawing the L and the rectangle is created, it will look like an upside down L is tacked on to the existing L and the lines are straightened accordingly. Obviously this might be too fast to notice at first but after extensive testing, it becomes more noticeable. Drawing a reverse L is not recommended as the program draws to the right, so a reverse L will still give the correct width and height, however the rectangle itself will look like it was flipped from the backwards L. Any other freehand draw may not produce the most accurate results.

- When pressing the trash can icon, the current canvas is cleared of all drawings.

- When pressing the backwards array icon, the most recent drawing is cleared.

Limitations:
1. When the user draws toward(or into) the edge of the canvas, some unexpected results occur such as the program drawing elsewhere on the screen and/or a line being created to that location.

2. Before the user moves the slider, the previous strokewidth is displayed. However, the slider is at the 0th value, so if the user wants a strokewidth of 0 and/or the strokewidth display to update accordingly, they have to move the slider.

3. For the X buttons in the color wheel, the buttons have to be pressed on the top half and may take a few presses and/or a harder press.

4. The app does not let the user know the current stroke color, fill color, or strokewidth when they are outside of the respective modals. The current shape is also not shown, so the user will have to remember all of these properties and if they do not remember, they can just press the buttons again.
*/


import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Pad from './components/view/pad';
import ColorPicker from 'react-native-wheel-color-picker';

export default function App() {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  const [multiSliderValue, setMultiSliderValue] = React.useState([0, 100]);
  multiSliderValuesChange = (values) => setMultiSliderValue(values);

  const [color, setColor] = useState('black');
  const [fill, setFill] = useState('none');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [shape2, setShape2] = useState('none');

  const onColor = (color) => {
    setColor(color);
    setFill('none');
    setShape2('none');
    setModalVisible1(!modalVisible1);
  };
  const onPressFill = (color2) => {
    setFill(color2);
    setModalVisible2(!modalVisible2);
  };

  const xPress = () => {
    setStrokeWidth(multiSliderValue[0]);
    setModalVisible3(!modalVisible3);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[styles.container, { height: '100%', width: '100%' }]}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}>
          <View style={{ width: '100%', height: '100%', padding: '1%' }}>
            <SafeAreaView
              style={[styles.container, { height: '100%', width: '100%' }]}>
              <TouchableOpacity
                style={{ height: '10%', width: '100%' }}
                onPress={() => setModalVisible1(!modalVisible1)}>
                <Image
                  source={require('./assets/x.png')}
                  style={styles.image_}
                />
              </TouchableOpacity>
              <ColorPicker
                color={color}
                onColorChange={(color) => setColor(color)}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
                style={{ flex: 1, top: '-5%' }}
              />
              <TouchableOpacity
                style={{ height: '10%', width: '100%', top: '5%' }}
                onPress={() => onColor('white')}>
                <Text style={styles.paragraph}> Erase </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}>
          <View style={{ width: '100%', height: '100%', padding: '1%' }}>
            <SafeAreaView
              style={[styles.container, { height: '100%', width: '100%' }]}>
              <TouchableOpacity
                style={{ height: '10%', width: '100%' }}
                onPress={() => setModalVisible2(!modalVisible2)}>
                <Image
                  source={require('./assets/x.png')}
                  style={styles.image_}
                />
              </TouchableOpacity>
              <ColorPicker
                color={fill}
                onColorChange={(color) => setFill(color)}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={{ height: '10%', width: '100%', top: '5%' }}
                onPress={() => onPressFill('none')}>
                <Text style={styles.paragraph}> No Fill </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible3}
          onRequestClose={() => {
            setModalVisible3(!modalVisible3);
          }}>
          <View
            style={{
              width: '100%',
              height: '10%',
              top: '12%',
              alignItems: 'center',
            }}>
            <Text style={styles.paragraph}>
              {' '}
              Stroke: {multiSliderValue[0]}{' '}
            </Text>
            <MultiSlider
              values={[0]}
              sliderOneValue={multiSliderValue[0]}
              sliderOneValuesChange={multiSliderValuesChange}
              sliderLength={300}
              onValuesChange={multiSliderValuesChange}
              min={0}
              max={100}
            />
            <TouchableOpacity
              style={styles.props_for_button}
              onPress={() => xPress()}>
              <Image source={require('./assets/x.png')} style={styles.image_} />
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={{ flexDirection: 'row', width: '100%', height: '20%' }}>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setModalVisible1(!modalVisible1)}>
            <Image
              source={require('./assets/brush.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setModalVisible2(!modalVisible2)}>
            <Image
              source={require('./assets/bucket.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setModalVisible3(!modalVisible3)}>
            <Image
              source={require('./assets/size.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setShape2('none')}>
            <Image
              source={require('./assets/curve.png')}
              style={styles.image_}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setShape2('line')}>
            <Image
              source={require('./assets/line.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setShape2('circle')}>
            <Image
              source={require('./assets/circle.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.props_for_button}
            onPress={() => setShape2('rect')}>
            <Image
              source={require('./assets/rectangle.png')}
              style={styles.image_}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: '80%', width: '100%' }}>
          <Pad
            color={color}
            fill={fill}
            strokeWidth={strokeWidth}
            shape2={shape2}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '1.2%',
    backgroundColor: 'gray',
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  props_for_button: {
    height: '100%',
    width: '14%',
    textAlign: 'center',
    paddingHorizontal: '1%',
  },
  image_: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});
