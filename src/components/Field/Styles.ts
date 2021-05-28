import globalVariables from 'components/variables'
import { Platform, StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const {
  hoverBg,
  borderBg,
  subColor,
  fontWeight,
  lineHeight,
  borderRadius,
  revColor,
  colors: { primaryFn, dangerFn, danger },
} = globalVariables

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    borderColor: borderBg,
    alignItems: 'stretch',
    marginHorizontal: 15,
    ...Platform.select({
      android: {
        paddingBottom: 2,
      },
    }),
  },
  fieldFocusing: {
    backgroundColor: primaryFn(0.5),
  },
  fieldDisabled: {
    backgroundColor: hoverBg,
  },
  fieldGroup: {
    marginHorizontal: 0,
    marginTop: 15,
    backgroundColor: CustomColors.White,
    padding: 15,
  },
  fieldGroupMargin: {
    marginTop: 30,
  },
  fieldTransparent: {
    borderColor: CustomColors.Transparent,
    marginHorizontal: 0,
  },
  fieldLabel: {
    paddingTop: 13,
    paddingBottom: 0,
    paddingLeft: 7,
    ...Platform.select({
      android: {
        paddingTop: 3,
        top: 6,
      },
      web: {
        // Fix form auto fill style on web
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
    }),
  },
  fieldLabelText: {
    color: subColor,
    fontWeight: fontWeight,
  },
  fieldLabelTextGroup: {
    ...Platform.select({
      android: {
        top: -6,
      },
    }),
  },
  fieldTextInput: {
    width: '100%',
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 40,
    fontWeight: 'bold',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight: lineHeight,
        // Should not set height and overflow here
        //    it will cause scroll issue with the input
        // height: g.lineHeight,
      },
      web: {
        // Fix form auto fill style on web
        paddingTop: 28,
      },
      default: {
        paddingTop: 1,
      },
    }),
  },
  fieldSwitch: {
    position: 'absolute',
    top: 22,
    right: 11,
  },
  fieldBtn: {
    position: 'absolute',
    top: 11,
    right: 5,
    width: 40,
    height: 30,
    borderRadius: borderRadius,
  },
  fieldBtnCreate: {
    backgroundColor: primaryFn(0.5),
  },
  fieldBtnRemove: {
    backgroundColor: dangerFn(0.5),
  },
  fieldIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  fieldError: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldErrorInner: {
    alignSelf: 'flex-start',
    marginVertical: 2,
    marginHorizontal: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: danger,
    borderRadius: borderRadius,
  },
  fieldErrorIcon: {
    position: 'absolute',
    top: -8,
    left: 2,
  },
  fieldErrorLabel: {
    color: revColor,
  },
})

export default styles
