import globalVariables from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const {
  subColor,
  colors: { primaryFn },
} = globalVariables

const styles = StyleSheet.create({
  outer: {
    marginLeft: 16,
    paddingRight: 6,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: CustomColors.DarkGrey,
  },
  topBorder: {
    borderTopWidth: 1,
    borderColor: CustomColors.DarkGrey,
  },
  inner: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  innerSelected: {
    backgroundColor: CustomColors.GreenOpacity,
  },
  withSpace: {
    marginVertical: 5,
  },
  text: {
    flex: 1,
    fontSize: CustomFonts.MediumText,
  },
  nameWithStatus: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  status: {
    top: 2,
    left: 3,
    color: subColor,
  },
  detail: {
    flexDirection: 'row',
  },
  callIcon: {
    flex: null as any,
  },
  callCreatedAt: {
    left: 3,
    color: CustomColors.DarkAsh,
  },
  buttonIcon: {
    padding: 10,
  },
  lastDate: {
    marginVertical: 10,
    marginRight: 15,
    paddingTop: 7,
  },
  nameAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  nameAvatar: {
    width: 35,
    height: 35,
    padding: 0,
    borderRadius: 30,
  },
})

export default styles
