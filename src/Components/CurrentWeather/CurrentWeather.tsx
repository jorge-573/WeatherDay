import type { TimeOfDay } from "../../types/timeOfDay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import clearNightBackground from "../../assets/backgrounds/NightSky.png";
import {
  City,
  ConditionIconWrap,
  ConditionText,
  Condition,
  CurrentStateRow,
  MetaRow,
  MetaTag,
  Summary,
  Temperature,
  Visual,
  Wrapper,
} from "./CurrentWeather.styles";

type CurrentWeatherProps = {
  timeOfDay: TimeOfDay;
};

export function CurrentWeather({ timeOfDay }: CurrentWeatherProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Summary>
        <div>
          <City>San Francisco, CA</City>
          <CurrentStateRow>
            <ConditionIconWrap>
              <WbSunnyIcon sx={{ fontSize: 100 }} />
            </ConditionIconWrap>
            <ConditionText>
              <Temperature>72 deg</Temperature>
              <Condition>Mostly Sunny</Condition>
            </ConditionText>
          </CurrentStateRow>
        </div>
        <MetaRow>
          <MetaTag $timeOfDay={timeOfDay}>H: 76 | L: 58</MetaTag>
          <MetaTag $timeOfDay={timeOfDay}>Feels like 74</MetaTag>
        </MetaRow>
      </Summary>

      <Visual $timeOfDay={timeOfDay} $backgroundImage={clearNightBackground}>
      </Visual>
    </Wrapper>
  );
}
