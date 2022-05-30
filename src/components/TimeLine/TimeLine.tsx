import React, { useCallback, useContext, useRef } from 'react';
import styled from 'styled-components';
import { calculateWidthValue as calculateWidth } from '../../utils';
import { last } from 'lodash';
import { DateTime } from 'luxon';
import calculateNewInterval from './utils';
import { Context } from '../../state/store';

interface RootProps {
  width: number;
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: auto;
`;

const Content = styled.div<RootProps>`
  position: relative;
  height: 100px;
  background: #f0f0f0;
  width: ${({ width }) => width}px;
`;

interface TimeLineProps {
  /**
   * Time of the day from which first event displayed on the TimeLine can start. Defaults to 00:00:00:00 local time.
   */
  timeLineStart: DateTime;
}

const TimeLine: React.FC<TimeLineProps> = ({ children, timeLineStart }) => {
  const { events, selectedStart, selectedEnd, dispatch } = useContext(Context);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const width = calculateWidth(timeLineStart, DateTime.fromISO(last(events)?.end ?? ''));

  const onClick = useCallback((e: React.MouseEvent) => {
    const { start, end } = calculateNewInterval(
      timeLineStart,
      selectedStart,
      selectedEnd,
      contentRef.current!,
      e.clientX,
    );

    dispatch({ type: 'SET_START', value: start });
    dispatch({ type: 'SET_END', value: end });
  }, []);

  return (
    <Root>
      <Content ref={contentRef} width={width} onClick={onClick}>
        {children}
      </Content>
    </Root>
  );
};

export default TimeLine;
