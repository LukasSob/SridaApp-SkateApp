import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import colours from '../components/Colours';
import Header from '../components/Header';


function EventsScreen({ navigation }) {
  return (
    <Container>
      <Body>
        <View>
          <RowStyle>
            <ColumnStyle key="th1">
              <ColumnText>Add</ColumnText>
            </ColumnStyle>
          </RowStyle>
          <DivideHeader />
        </View>
      </Body>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: ${colours.background};
`;


const Body = styled.ScrollView`
  background: #495867;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 16%;
`;

const BodyText = styled.Text`
  color: white;
  font-size: 15px;
  margin: 20px 20px;
`;

const RowStyle = styled.View`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
`;
const ColumnStyle = styled.View`
  flex: 1;
  height: 30px;
  align-items: center;
`;

const ColumnText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
`;

const Divide = styled.View`
  background: #fff;
  height: 1px;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
`;
const DivideHeader = styled.View`
  background: #fff;
  height: 1px;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;
const TouchButton = styled.TouchableOpacity`
  margin-left: 10px;
  margin-right: 10px;
`;

const Btn = styled.Button`
  height: 50px;
  width: 150px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: absolute;
  left: 150px;
  top: 150px;
  z-index: 9999;
  background: #333;
`;

const HeaderText = styled.Text`
  color: white;
  font-size: 25px;
  margin-top: 5%;
  margin-left: 20px;
  font-weight: bold;
  text-align: center;
`;
const Submit = styled.View`
  flex: 1;
  height: 50px;
  border-radius: 15px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background: ${colours.red};
  height: 50px;
`;
const BtnText = styled.Text`
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 30px;
`;

export default EventsScreen;