import { Emphasis, Strip, StripInner, Title } from './SectionTitleBar.styles';

export interface SectionTitleBarProps {
  prefix: string;
  emphasis: string;
}

export function SectionTitleBar({ prefix, emphasis }: SectionTitleBarProps) {
  return (
    <Strip>
      <StripInner>
        <Title>
          {prefix} <Emphasis>{emphasis}</Emphasis>
        </Title>
      </StripInner>
    </Strip>
  );
}
