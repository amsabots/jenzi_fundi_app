import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import {UISettings} from '../../store/ui-store';
import {UISettingsActions} from '../store-actions';

const mapStateToProps = state => {
  const {ui_settings} = state;
  return {ui_settings};
};

const SnackView = ({ui_settings}) => {
  const [snack_visible, setSnackVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (ui_settings.snack_visible) setSnackVisible(true);
    else setSnackVisible(false);
  }, [ui_settings]);
  return (
    <Snackbar
      visible={snack_visible}
      onDismiss={() => dispatch(UISettingsActions.toggle_snack_bar(''))}
      action={{
        label: 'Hide',
        onPress: () => setSnackVisible(false),
      }}>
      {ui_settings.snack_visible}
    </Snackbar>
  );
};

export default connect(mapStateToProps)(SnackView);
