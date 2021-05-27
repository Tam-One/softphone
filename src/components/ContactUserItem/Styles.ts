import g from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  outer: {
    borderBottomWidth: 1,
    borderColor: CustomColors.DarkGrey,
  },
  inner: {
    flexDirection: 'row',
    paddingLeft: 10,
    padding: 14,
    alignItems: 'center',
  },
  innerSelected: {
    backgroundColor: g.colors.primaryFn(0.5),
  },
  withSpace: {
    marginVertical: 5,
  },
  text: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
  },
  nameWithStatus: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  status: {
    top: 2,
    left: 3,
    color: g.subColor,
  },
  detail: {
    flexDirection: 'row',
  },
  callIcon: {
    flex: null as any,
  },
  callCreatedAt: {
    left: 3,
    color: g.subColor,
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
  },
  nameAvatar: {
    width: 35,
    height: 35,
    padding: 0,
    borderRadius: 30,
  },
})

export default styles
