import g from 'components/variables'
import { Platform, StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    borderColor: g.borderBg,
    alignItems: 'stretch',
    marginHorizontal: 15,
    ...Platform.select({
      android: {
        paddingBottom: 2,
      },
    }),
  },
  fieldFocusing: {
    backgroundColor: g.colors.primaryFn(0.5),
  },
  fieldDisabled: {
    backgroundColor: g.hoverBg,
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
    color: g.subColor,
    fontWeight: g.fontWeight,
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
        lineHeight: g.lineHeight,
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
    borderRadius: g.borderRadius,
  },
  fieldBtnCreate: {
    backgroundColor: g.colors.primaryFn(0.5),
  },
  fieldBtnRemove: {
    backgroundColor: g.colors.dangerFn(0.5),
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
    backgroundColor: g.colors.danger,
    borderRadius: g.borderRadius,
  },
  fieldErrorIcon: {
    position: 'absolute',
    top: -8,
    left: 2,
  },
  fieldErrorLabel: {
    color: g.revColor,
  },
})

export default styles
