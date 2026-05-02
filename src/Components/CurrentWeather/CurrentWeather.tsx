import SunnyIcon from "@mui/icons-material/Sunny";
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

export function CurrentWeather() {
  return (
    <Wrapper>
      <Visual $backgroundImage={clearNightBackground} />
      <Summary>
        <div>
          <City>San Francisco, CA</City>
          <CurrentStateRow>
            <ConditionIconWrap>
              <SunnyIcon sx={{ fontSize: 125 }} />
            </ConditionIconWrap>
            <ConditionText>
              <Temperature>72 deg</Temperature>
              <Condition>Mostly Sunny</Condition>
            </ConditionText>
          </CurrentStateRow>
        </div>
        <MetaRow>
          <MetaTag>H: 76 | L: 58</MetaTag>
          <MetaTag>Feels like 74</MetaTag>
        </MetaRow>
      </Summary>
    </Wrapper>
  );
}
