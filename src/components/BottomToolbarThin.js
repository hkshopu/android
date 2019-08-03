import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { colors } from '../theme';
import PropTypes from 'prop-types';

const Toolbar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border: 1px solid ${colors.gray};
  background-color: ${colors.white};
`;

const ToolbarFilter = styled.View`
  flex: 2;
  padding: 10px;
`;

const ToolbarActionsContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ToolbarAction = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-left-width: 1;
  border-left-color: ${colors.gray};
  border-style: solid;
`;

const ToolAction = styled.TouchableOpacity`
  padding: 10px;
`;

const Action = styled.TouchableOpacity`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

class BottomToolbarThin extends PureComponent {
  render() {
	const { actions } = this.props;

    return(
	<Toolbar>
	    <ToolbarFilter>
          <Text>All</Text>
        </ToolbarFilter>
        <ToolbarActionsContainer>
        {
          actions.map((action, index) => {
            return (
              <ToolbarAction key={index} size={action.size} >
                <Action  onPress={action.onClickHandler}>
                  <FontAwesome name={action.icon} size={20} color={colors.black} />
                  { action.label && <Text>{action.label}</Text> }
                </Action>
              </ToolbarAction>
            );
          })
        }
		</ToolbarActionsContainer>
      </Toolbar>
    );
  }
}

BottomToolbarThin.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.number,
    onClickHandler: PropTypes.func,
  }))
};

export default BottomToolbarThin;