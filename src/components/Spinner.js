import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { colors } from '../theme';
import PropTypes from 'prop-types';
import ModalLoading from 'react-native-modal';

const BackContainer = styled.View`
flex: 1;
flex-direction: row;
justify-content: center;
align-items: center;
`;

const Container = styled.View`
width: 60px;
height: 60px;
background-color: ${colors.white};
padding: 5px;
border-radius: 10px;
opacity: 0.5;
`;

class Spinner extends PureComponent {
    render() {
        return (
            <ModalLoading
                isVisible={this.props.isVisible}
            >
                <BackContainer>
                    <Container>
                        <View >
                            <Image source={require("../img/Spinner-1s-200px.gif")}
                                style={{ width: 50, height: 50 }} />
                        </View>
                    </Container>
                </BackContainer>
            </ModalLoading>
        );
    }
}

Spinner.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default Spinner;