import * as React from 'react'
import Svg, { Circle, ClipPath, Defs, G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

export const ProfileIcon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={23} height={23} {...props}>
    <Path d='M11.5 0A11.5 11.5 0 1 0 23 11.5 11.5 11.5 0 0 0 11.5 0M5.83 18.722c.495-1.035 3.507-2.047 5.669-2.047s5.175 1.012 5.67 2.047a9.114 9.114 0 0 1-11.339 0m12.984-1.668c-1.645-2-5.635-2.68-7.314-2.68s-5.669.679-7.314 2.68A9.117 9.117 0 0 1 2.3 11.5a9.2 9.2 0 0 1 18.4 0 9.117 9.117 0 0 1-1.886 5.555M11.5 4.6a4.025 4.025 0 1 0 4.025 4.025A4.015 4.015 0 0 0 11.5 4.6m0 5.75a1.725 1.725 0 1 1 1.725-1.725A1.725 1.725 0 0 1 11.5 10.35Z' />
  </Svg>
)

export const KeyIcon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={23} height={11.631} {...props}>
    <Path d='M6.273 7.754a2.019 2.019 0 0 1-2.091-1.938 2.019 2.019 0 0 1 2.091-1.939 2.019 2.019 0 0 1 2.091 1.938 2.019 2.019 0 0 1-2.091 1.938m5.907-3.876A6.25 6.25 0 0 0 6.273 0 6.057 6.057 0 0 0 0 5.815a6.057 6.057 0 0 0 6.273 5.815 6.25 6.25 0 0 0 5.907-3.877h4.548v3.877h4.182V7.754H23V3.877Z' />
  </Svg>
)

export const LockButton = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={23} height={23} {...props}>
    <Path d='M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z' />
  </Svg>
)

export const EyeOffIcon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M11.83 9 15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8 1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z' />
  </Svg>
)

export const EyeIcon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z' />
  </Svg>
)

export const Dialpad = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M12 19a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2M6 1a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m12-8a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m-6 8a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m6 0a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0-6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m-6 0a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0-6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2Z' />
  </Svg>
)

export const History = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M13.5 8H12v5l4.28 2.54.72-1.21-3.5-2.08V8M13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0 0 13 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9' />
  </Svg>
)

export const Person = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} {...props}>
    <Defs>
      <ClipPath id='a'>
        <Circle
          data-name='Ellipse 462'
          cx={9.703}
          cy={9.703}
          r={9.703}
          fill='#2f3443'
        />
      </ClipPath>
    </Defs>
    <G data-name='Group 3250' transform='translate(-177.584 -555.717)'>
      <Circle
        data-name='Ellipse 458'
        cx={10}
        cy={10}
        r={10}
        transform='translate(177.584 555.718)'
        fill='#999'
      />
      <G data-name='Group 3043'>
        <G data-name='Group 3047' transform='translate(177.881 555.717)'>
          <Circle
            data-name='Ellipse 459'
            cx={8.562}
            cy={8.562}
            r={8.562}
            transform='translate(1.142 1.484)'
            fill='#2e2e2f'
          />
          <G data-name='Mask Group 13' clipPath='url(#a)'>
            <G data-name='Group 3046' fill='#999'>
              <G data-name='Path 3272'>
                <Path d='M9.63 35.676c-2.879 0-5.585-1.121-7.62-3.156a10.705 10.705 0 0 1-3.156-7.62c0-2.878 1.12-5.584 3.156-7.619a10.705 10.705 0 0 1 7.62-3.156c2.878 0 5.584 1.12 7.619 3.156a10.705 10.705 0 0 1 3.156 7.62c0 2.878-1.121 5.584-3.156 7.619a10.705 10.705 0 0 1-7.62 3.156Z' />
                <Path d='M9.63 14.625c-5.666 0-10.276 4.61-10.276 10.275 0 5.666 4.61 10.276 10.275 10.276 5.666 0 10.276-4.61 10.276-10.276 0-5.665-4.61-10.275-10.276-10.275m0-1c6.228 0 11.276 5.048 11.276 11.275 0 6.228-5.048 11.276-11.276 11.276-6.227 0-11.275-5.048-11.275-11.276 0-6.227 5.048-11.275 11.275-11.275Z' />
              </G>
              <G
                data-name='Ellipse 465'
                transform='translate(5.701 4.4)'
                stroke='#999'
              >
                <Circle cx={3.918} cy={3.918} r={3.918} stroke='none' />
                <Circle cx={3.918} cy={3.918} r={3.418} fill='none' />
              </G>
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export const Cog = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z' />
  </Svg>
)

export const BackButton = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' height={24} width={24} {...props}>
    <Path d='M0 0h24v24H0V0z' fill='none' opacity={0.87} />
    <Path d='M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z' />
  </Svg>
)

export const ConferenceButton = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={55} height={55} {...props}>
    <G data-name='Group 3451' transform='translate(790.24 -12785)'>
      <Circle
        data-name='Ellipse 492'
        cx={27.5}
        cy={27.5}
        r={27.5}
        transform='translate(-790.24 12785)'
        fill='#35ce95'
      />
      <Path
        d='M-755.24 12816.5a11.36 11.36 0 0 1-3.57-.57 1 1 0 0 0-1.02.25l-2.2 2.2a15.1 15.1 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02 11.36 11.36 0 0 1-.57-3.57 1 1 0 0 0-1-1h-3.5a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1m-2-4.5 5-5-5-5v3h-4v4h4Z'
        fill='#fff'
      />
    </G>
  </Svg>
)

export const TransferButton = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={55} height={55} {...props}>
    <G data-name='Group 3452' transform='translate(712.24 -12816)'>
      <Circle
        data-name='Ellipse 493'
        cx={27.5}
        cy={27.5}
        r={27.5}
        transform='translate(-712.24 12816)'
        fill='#ff5252'
      />
      <Path
        d='M-685.24 12841a14.911 14.911 0 0 0-4.6.72v3.1a1 1 0 0 1-.56.9 11.788 11.788 0 0 0-2.67 1.85.939.939 0 0 1-.67.29 1.017 1.017 0 0 1-.73-.3l-2.48-2.48a1 1 0 0 1 0-1.41 17.016 17.016 0 0 1 23.42 0 1 1 0 0 1 0 1.41l-2.48 2.48a1.017 1.017 0 0 1-.73.3.98.98 0 0 1-.68-.29 11.511 11.511 0 0 0-2.66-1.85 1 1 0 0 1-.56-.9v-3.1a14.911 14.911 0 0 0-4.6-.72Z'
        fill='#fff'
      />
    </G>
  </Svg>
)

export const GreenCallButton = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' height={24} width={24} {...props}>
    <Path d='M0 0h24v24H0V0z' fill='none' />
    <Path d='m19.23 15.26-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z' />
  </Svg>
)

export const MicrophoneOff = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M19 11c0 1.19-.34 2.3-.9 3.28l-1.23-1.23c.27-.62.43-1.31.43-2.05H19m-4 .16L9 5.18V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v6.16M4.27 3 21 19.73 19.73 21l-4.19-4.19c-.77.46-1.63.77-2.54.91V21h-2v-3.28c-3.28-.49-6-3.31-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1.81 0 1.6-.19 2.31-.52l-1.66-1.66L12 14a3 3 0 0 1-3-3v-.72L3 4.27 4.27 3Z' />
  </Svg>
)

export const MicrophoneOn = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5 5 5 0 0 0 5-5h2Z' />
  </Svg>
)

export const Play = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' height={24} width={24} {...props}>
    <Path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 13.5v-7a.5.5 0 0 1 .8-.4l4.67 3.5c.27.2.27.6 0 .8l-4.67 3.5a.5.5 0 0 1-.8-.4z' />
  </Svg>
)

export const Pause = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' height={24} width={24} {...props}>
    <Path d='M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z' />
  </Svg>
)

export const VideoOn = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z' />
  </Svg>
)

export const VideoOff = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M3.27 2 2 3.27 4.73 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12c.2 0 .39-.08.54-.18L19.73 21 21 19.73M21 6.5l-4 4V7a1 1 0 0 0-1-1H9.82L21 17.18V6.5Z' />
  </Svg>
)

export const VolumeMedium = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M5 9v6h4l5 5V4L9 9m9.5 3c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4Z' />
  </Svg>
)

export const VolumeHigh = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77 0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3Z' />
  </Svg>
)

export const Record = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path d='M19 12c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7 7 3.14 7 7Z' />
  </Svg>
)

export const RecordCircleRed = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={23} height={23} {...props}>
    <G data-name='Group 3506' transform='translate(2831 -9681.575)'>
      <Path
        d='M-2819.537 9681.575a11.463 11.463 0 1 0 11.462 11.463 11.463 11.463 0 0 0-11.462-11.463m0 8.024a3.439 3.439 0 1 1-3.439 3.439 3.439 3.439 0 0 1 3.439-3.439Z'
        fill='#fff'
      />
      <Circle
        data-name='Ellipse 499'
        cx={3.5}
        cy={3.5}
        r={3.5}
        transform='translate(-2823 9689.5)'
        fill='#fb0057'
        opacity={0.997}
      />
    </G>
  </Svg>
)

export const RecordCircleMaroon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={23} height={23} {...props}>
    <G data-name='Group 3508'>
      <G data-name='Group 3507' transform='translate(7.925 7.925)'>
        <Circle
          data-name='Ellipse 501'
          cx={3.5}
          cy={3.5}
          r={3.5}
          fill='#3f88ff'
        />
        <Path
          data-name='Path 4444'
          d='M3.5 0A3.5 3.5 0 1 1 0 3.5 3.5 3.5 0 0 1 3.5 0Z'
          fill='#fb0057'
          opacity={0.529}
        />
      </G>
      <Path
        d='M11.463 0a11.463 11.463 0 1 0 11.462 11.463A11.463 11.463 0 0 0 11.463 0m0 8.024a3.439 3.439 0 1 1-3.439 3.439 3.439 3.439 0 0 1 3.439-3.439Z'
        fill='#fff'
      />
    </G>
  </Svg>
)

export const Park = props => (
  <Svg
    data-name='Group 3322'
    xmlns='http://www.w3.org/2000/svg'
    width={23}
    height={23}
    {...props}
  >
    <Circle
      data-name='Ellipse 476'
      cx={11.401}
      cy={11.401}
      r={11.401}
      fill='#2F3443'
    />
    <Path
      d='M13.177 10.815h-1.875V8.471h1.875a1.172 1.172 0 1 1 0 2.344m-.119-4.688h-4.1v10.548h2.344v-3.516h1.756a3.516 3.516 0 0 0 0-7.032Z'
      fill='#f7fbff'
    />
  </Svg>
)

export const Keys = props => (
  <Svg
    data-name='Group 3323'
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    {...props}
  >
    <Circle
      data-name='Ellipse 445'
      cx={3.038}
      cy={3.038}
      r={3.038}
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 446'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(8.838)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 447'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(17.676)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 448'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(0 8.598)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 449'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(8.838 8.598)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 450'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(17.676 8.598)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 454'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(0 17.196)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 455'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(8.838 17.196)'
      fill='#2f3443'
    />
    <Circle
      data-name='Ellipse 456'
      cx={3.038}
      cy={3.038}
      r={3.038}
      transform='translate(17.676 17.196)'
      fill='#2f3443'
    />
  </Svg>
)

export const Transfer = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    width={26.687}
    height={18.903}
    {...props}
  >
    <Path
      data-name='Path 3282'
      d='M1.112 6.116H22.89L20.9 8.11a1.112 1.112 0 1 0 1.572 1.572l3.892-3.892a1.112 1.112 0 0 0 0-1.572L22.472.326A1.112 1.112 0 1 0 20.9 1.9l1.994 1.994H1.112a1.112 1.112 0 0 0 0 2.224Z'
      fill='#2f3443'
    />
    <Path
      data-name='Path 3283'
      d='M25.575 12.787H3.8l1.99-1.992a1.112 1.112 0 1 0-1.572-1.572l-3.892 3.89a1.112 1.112 0 0 0 0 1.572l3.892 3.892a1.112 1.112 0 0 0 1.572-1.572L3.8 15.011h21.775a1.112 1.112 0 0 0 0-2.224Z'
      fill='#2f3443'
    />
  </Svg>
)

export const DeclineButton = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    style={props.style}
    width={props?.width || 80}
    height={props?.height || 80}
    {...props}
    viewBox='0 0 80 80'
  >
    <G data-name='Group 3022'>
      <G data-name='Group 3021'>
        <G data-name='Group 3'>
          <G data-name='Group 5'>
            <Circle
              data-name='Ellipse 24'
              cx={40}
              cy={40}
              r={40}
              style={{
                fill: '#ff5252',
              }}
            />
            <G>
              <Path
                data-name='Path 1'
                d='m31.512 25.92-6.535-4.584a1.939 1.939 0 0 0-2.6.361l-1.993 2.441a.827.827 0 0 1-1.065.2l-.363-.212a22.232 22.232 0 0 1-5.688-4.687 22.337 22.337 0 0 1-4.415-5.9l-.193-.373A.828.828 0 0 1 8.9 12.1l2.53-1.875a1.938 1.938 0 0 0 .483-2.585L7.641.9A1.93 1.93 0 0 0 5.055.253L2.24 1.855A3.915 3.915 0 0 0 .4 4.131C-.687 7.75-.082 14.056 8.961 23.536c7.194 7.541 12.632 9.651 16.4 9.74A9.671 9.671 0 0 0 27.94 33a3.911 3.911 0 0 0 2.36-1.731l1.735-2.735a1.929 1.929 0 0 0-.523-2.614Z'
                transform='rotate(135 23.075 33.218)'
                style={{
                  fill: '#fff',
                }}
              />
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export const AcceptButton = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    style={props.style}
    width={props?.width || 80}
    height={props?.height || 80}
    {...props}
    viewBox='0 0 80 80'
  >
    <G data-name='Group 3249'>
      <G data-name='Group 5'>
        <Circle
          data-name='Ellipse 24'
          cx={40}
          cy={40}
          r={40}
          style={{
            fill: '#35ce95',
          }}
          viewBox='0 0 35 35'
        />
        <G>
          <Path
            data-name='Path 1'
            d='m-443.585 832.263-5.127-3.6a1.521 1.521 0 0 0-2.043.283l-1.564 1.915a.649.649 0 0 1-.836.155l-.285-.166a17.442 17.442 0 0 1-4.462-3.677 17.522 17.522 0 0 1-3.463-4.63l-.152-.292a.649.649 0 0 1 .191-.831l1.985-1.471a1.521 1.521 0 0 0 .379-2.028l-3.351-5.291a1.514 1.514 0 0 0-2.028-.507l-2.208 1.257a3.071 3.071 0 0 0-1.444 1.785c-.852 2.839-.378 7.785 6.716 15.223 5.644 5.915 9.91 7.571 12.867 7.641a7.588 7.588 0 0 0 2.022-.216 3.068 3.068 0 0 0 1.851-1.358l1.361-2.146a1.513 1.513 0 0 0-.409-2.046Z'
            transform='translate(495.23 -784.92)'
            style={{
              fill: '#fff',
            }}
          />
        </G>
      </G>
    </G>
  </Svg>
)

export const TransferCallIcon = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    width={props.width || 57}
    height={props.height || 33}
    {...props}
    viewBox={props.viewBox || '0 0 57 33'}
  >
    <G fill={props.color || 'black'}>
      <Path d='M20.245 19.039v-4.253h5.67v-3.43l5.557 5.556-5.557 5.557v-3.43z' />
      <Path d='M12.691 10.518a19.172 19.172 0 0 0 0 11.835h3.951c.503 0 .925.279 1.14.692a14.427 14.427 0 0 0 2.695 3.717 1.27 1.27 0 0 1 0 1.796l-3.143 3.143a1.27 1.27 0 0 1-1.796 0c-8.431-8.43-8.431-22.1 0-30.53a1.27 1.27 0 0 1 1.796 0l3.143 3.142a1.27 1.27 0 0 1 0 1.796 14.427 14.427 0 0 0-2.694 3.718 1.274 1.274 0 0 1-1.14.691H12.69ZM36.82 10.518a19.172 19.172 0 0 0 0 11.835h3.95c.504 0 .926.279 1.141.692a14.427 14.427 0 0 0 2.694 3.717 1.27 1.27 0 0 1 0 1.796l-3.143 3.143a1.27 1.27 0 0 1-1.796 0c-8.43-8.43-8.43-22.1 0-30.53a1.27 1.27 0 0 1 1.796 0l3.143 3.142a1.27 1.27 0 0 1 0 1.796 14.427 14.427 0 0 0-2.694 3.718 1.274 1.274 0 0 1-1.14.691H36.82Z' />
    </G>
  </Svg>
)

export const CancelConference = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <G fill='#FFF'>
      <Path d='M11.119 9.367 9.902 8.158v2.11H6.415v2.617h1.186z' />
      <Path d='M5.53 14.933H3.105a11.77 11.77 0 0 1 0-7.283H5.53a.77.77 0 0 0 .708-.423 8.568 8.568 0 0 1 1.655-2.31.77.77 0 0 0 0-1.108l-1.932-1.91a.77.77 0 0 0-1.109 0 13.287 13.287 0 0 0-2.17 15.936l2.848-2.902ZM7.631 17.365l-3.033 3.033c.085.093.162.193.254.285a.77.77 0 0 0 1.109 0l1.932-1.932a.77.77 0 0 0 0-1.109c-.054-.084-.177-.184-.262-.277ZM21.288 3.709 17.346 7.65h1.702a.77.77 0 0 0 .7-.423 8.922 8.922 0 0 1 1.655-2.31.77.77 0 0 0 0-1.108l-.115-.1ZM19.748 15.356a.77.77 0 0 0-.7-.423h-2.433a11.77 11.77 0 0 1-.27-6.282l-1.832 1.832a13.218 13.218 0 0 0 3.85 10.2.77.77 0 0 0 1.1 0l1.933-1.932a.77.77 0 0 0 0-1.109 8.922 8.922 0 0 1-1.648-2.286Z' />
      <Path d='M0 22.78 22.78 0 24 1.22 1.22 24z' />
    </G>
  </Svg>
)

export const TransferPageIcon = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} {...props}>
    <Path
      d='M20.4 17.4a13.632 13.632 0 0 1-4.284-.684 1.2 1.2 0 0 0-1.224.3l-2.64 2.64a18.12 18.12 0 0 1-7.908-7.908l2.64-2.64a1.2 1.2 0 0 0 .3-1.224A13.632 13.632 0 0 1 6.6 3.6a1.2 1.2 0 0 0-1.2-1.2H1.2A1.2 1.2 0 0 0 0 3.6C0 14.867 9.133 24 20.4 24a1.2 1.2 0 0 0 1.2-1.2v-4.2a1.2 1.2 0 0 0-1.2-1.2M18 12l6-6-6-6v3.6h-4.8v4.8H18V12Z'
      fill='#FFF'
    />
  </Svg>
)
